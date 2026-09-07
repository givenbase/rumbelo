import { Inject, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlanKey, PLAN_RANK } from '@rumbelo/contracts';
import Stripe from 'stripe';

import type { Env } from '../../../../common/config/env.config';
import { currentUserId } from '../../../../common/household/household.context';
import { HouseholdSettingsService } from '../../../auth/household/household-settings/household-settings.service';
import {
    stripeLookupKey,
    type BillingInterval,
    type PaidPlanKey,
} from './config/stripe-plans.config';

/**
 * Stripe Checkout for Plus / Max.
 * Prices resolve via stable lookup keys (seed with `pnpm stripe:seed-plans`).
 * When the secret key is unset (or BILLING_PREVIEW_BYPASS), plan changes stay free.
 */
@Injectable()
export class BillingService {
    private readonly logger = new Logger(BillingService.name);
    private readonly stripe: Stripe | null;
    /** Cache lookup_key → price_… for this process. */
    private readonly priceIdCache = new Map<string, string>();

    constructor(
        @Inject(ConfigService) private readonly config: ConfigService<Env, true>,
        @Inject(HouseholdSettingsService) private readonly settings: HouseholdSettingsService
    ) {
        const key = this.config.get('STRIPE_SECRET_KEY', { infer: true });
        this.stripe = key ? new Stripe(key) : null;
    }

    /** True when Stripe Checkout is the upgrade path. */
    isStripeEnabled(): boolean {
        return Boolean(this.stripe) && !this.isPreviewBypass();
    }

    /** Free planKey updates allowed (local / preview). */
    isPreviewBypass(): boolean {
        if (this.config.get('BILLING_PREVIEW_BYPASS', { infer: true })) return true;
        return !this.stripe;
    }

    async status() {
        return {
            stripeEnabled: this.isStripeEnabled(),
            previewBypass: this.isPreviewBypass(),
            prices: await this.loadPriceCatalog(),
        };
    }

    /**
     * Resolve lookup keys → amount / currency / label from Stripe.
     * Returns null when the secret key is unset.
     */
    private async loadPriceCatalog() {
        if (!this.stripe) return null;

        const slots: { plan: PaidPlanKey; interval: BillingInterval }[] = [
            { plan: PlanKey.PLUS, interval: 'month' },
            { plan: PlanKey.PLUS, interval: 'year' },
            { plan: PlanKey.MAX, interval: 'month' },
            { plan: PlanKey.MAX, interval: 'year' },
        ];

        const resolved = await Promise.all(
            slots.map(async ({ plan, interval }) => {
                const priceId = await this.priceIdFor(plan, interval);
                if (!priceId) return { plan, interval, display: null };
                try {
                    const price = await this.stripe!.prices.retrieve(priceId, {
                        expand: ['product'],
                    });
                    const product = price.product;
                    const productName =
                        typeof product === 'object' &&
                        product &&
                        !('deleted' in product && product.deleted)
                            ? product.name
                            : null;
                    return {
                        plan,
                        interval,
                        display: {
                            priceId: price.id,
                            amountCents: price.unit_amount ?? 0,
                            currency: price.currency,
                            label: price.nickname ?? productName,
                        },
                    };
                } catch (err) {
                    this.logger.warn(
                        `Failed to retrieve Stripe price ${priceId}: ${err instanceof Error ? err.message : String(err)}`
                    );
                    return { plan, interval, display: null };
                }
            })
        );

        const pick = (plan: PaidPlanKey, interval: BillingInterval) =>
            resolved.find(entry => entry.plan === plan && entry.interval === interval)?.display ??
            null;

        return {
            PLUS: { month: pick(PlanKey.PLUS, 'month'), year: pick(PlanKey.PLUS, 'year') },
            MAX: { month: pick(PlanKey.MAX, 'month'), year: pick(PlanKey.MAX, 'year') },
        };
    }

    /**
     * Reject client-driven upgrades to paid tiers when Stripe is live.
     * Downgrades to Basic and same-tier patches stay allowed.
     */
    assertFreePlanChangeAllowed(from: PlanKey, to: PlanKey): void {
        if (this.isPreviewBypass()) return;
        if (to === PlanKey.BASIC) return;
        if (PLAN_RANK[to] <= PLAN_RANK[from]) return;
        throw new ServiceUnavailableException(
            'Paid upgrades require Stripe Checkout — use billing.createCheckoutSession'
        );
    }

    async createCheckoutSession(input: {
        householdId: string;
        planKey: PaidPlanKey;
        interval: BillingInterval;
    }): Promise<{ url: string }> {
        if (!this.stripe || this.isPreviewBypass()) {
            throw new ServiceUnavailableException(
                'Stripe Checkout is not enabled — use household.updateSettings (preview / local)'
            );
        }

        const priceId = await this.priceIdFor(input.planKey, input.interval);
        if (!priceId) {
            throw new ServiceUnavailableException(
                `Missing Stripe price for ${input.planKey} / ${input.interval} — run pnpm stripe:seed-plans`
            );
        }

        const appOrigin = this.config.get('DOMAIN_APP', { infer: true });
        const userId = currentUserId();

        const session = await this.stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${appOrigin}/settings/general/plan?checkout=success`,
            cancel_url: `${appOrigin}/settings/general/plan?checkout=cancel`,
            client_reference_id: input.householdId,
            metadata: {
                householdId: input.householdId,
                planKey: input.planKey,
                userId,
            },
            subscription_data: {
                metadata: {
                    householdId: input.householdId,
                    planKey: input.planKey,
                },
            },
        });

        if (!session.url) {
            throw new ServiceUnavailableException('Stripe did not return a Checkout URL');
        }

        return { url: session.url };
    }

    async handleWebhookEvent(rawBody: Buffer, signature: string): Promise<void> {
        if (!this.stripe) {
            this.logger.warn('Stripe webhook received but STRIPE_SECRET_KEY is unset');
            return;
        }

        const secret = this.config.get('STRIPE_WEBHOOK_SIGNING_SECRET', { infer: true });
        if (!secret) {
            throw new ServiceUnavailableException('STRIPE_WEBHOOK_SIGNING_SECRET is unset');
        }

        const event = this.stripe.webhooks.constructEvent(rawBody, signature, secret);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const householdId =
                session.metadata?.householdId ?? session.client_reference_id ?? null;
            const planKey = session.metadata?.planKey as PlanKey | undefined;
            if (!householdId || !planKey) {
                this.logger.warn('checkout.session.completed missing householdId/planKey metadata');
                return;
            }
            if (planKey !== PlanKey.PLUS && planKey !== PlanKey.MAX) {
                this.logger.warn(`Ignoring checkout for unexpected planKey=${planKey}`);
                return;
            }
            await this.settings.update(householdId, { planKey }, { allowPaidUpgrade: true });
            this.logger.log(`Plan ${planKey} applied for household ${householdId} via Stripe`);
        }
    }

    /** Resolve `price_…` via lookup key (Meltizo-style). */
    private async priceIdFor(
        planKey: PaidPlanKey,
        interval: BillingInterval
    ): Promise<string | undefined> {
        if (!this.stripe) return undefined;

        const lookupKey = stripeLookupKey(planKey, interval);
        const cached = this.priceIdCache.get(lookupKey);
        if (cached) return cached;

        const listed = await this.stripe.prices.list({
            lookup_keys: [lookupKey],
            active: true,
            limit: 1,
        });
        const priceId = listed.data[0]?.id;
        if (!priceId) {
            this.logger.warn(
                `No active Stripe price for lookup_key=${lookupKey} — run pnpm stripe:seed-plans`
            );
            return undefined;
        }
        this.priceIdCache.set(lookupKey, priceId);
        return priceId;
    }
}
