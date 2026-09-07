import {
    type HouseholdKind,
    type HouseholdSettings as HouseholdSettingsDto,
    type HouseholdSettingsPatch,
    type PlanKey,
    PLAN_RANK,
    canUseHouseholdKind,
    capabilitiesFor,
    householdFitsPlan,
} from '@rumbelo/contracts';

import { EntityManager } from '@mikro-orm/postgresql';
import {
    BadRequestException,
    Inject,
    Injectable,
    ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Env } from '../../../../common/config/env.config';
import { AuthMember } from '../managed/member/auth-member.entity';
import { HouseholdBilling } from '../household-billing/household-billing.entity';
import { HouseholdBillingService } from '../household-billing/household-billing.service';
import {
    DEFAULT_FEATURE_SETTINGS,
    DEFAULT_MONEY_SETTINGS,
    DEFAULT_WEEK_CHECK_SETTINGS,
    HouseholdSettings,
} from './household-settings.entity';

/** Fields onboarding fixes at creation; everything else takes entity defaults. */
export interface CreateHouseholdSettingsInput {
    householdId: string;
    kind: HouseholdKind;
    planKey: PlanKey;
    currency: HouseholdSettingsDto['currency'];
    why: string | null;
    money: Partial<HouseholdSettingsDto['money']>;
}

/**
 * Household money-board preferences (`household_settings`).
 *
 * One row per Better Auth household; created by onboarding or lazily on first
 * read. Plan tier lives on {@link HouseholdBilling}; this DTO still exposes
 * `planKey` for the app by composing both rows.
 */
@Injectable()
export class HouseholdSettingsService {
    constructor(
        @Inject(EntityManager) private readonly em: EntityManager,
        @Inject(ConfigService) private readonly config: ConfigService<Env, true>,
        @Inject(HouseholdBillingService) private readonly billing: HouseholdBillingService
    ) {}

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    /**
     * Seed settings + billing during onboarding. Caller flushes.
     * Billing is persisted here so planKey is set before first get().
     */
    create(input: CreateHouseholdSettingsInput): HouseholdSettings {
        const settings = this.em.create(HouseholdSettings, {
            household: input.householdId,
            kind: input.kind,
            currency: input.currency,
            why: input.why,
            moneySettings: { ...DEFAULT_MONEY_SETTINGS, ...input.money },
            weekCheckSettings: { ...DEFAULT_WEEK_CHECK_SETTINGS },
            featureSettings: { ...DEFAULT_FEATURE_SETTINGS },
            answers: {},
            onboardedAt: new Date(),
        } as never);
        this.em.persist(
            this.em.create(HouseholdBilling, {
                household: input.householdId,
                planKey: input.planKey,
            } as never)
        );
        return settings;
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Settings row is created lazily so onboarding never has to pre-seed it. */
    async get(householdId: string): Promise<HouseholdSettingsDto> {
        let row = await this.em.findOne(HouseholdSettings, { household: householdId });
        if (!row) {
            row = this.em.create(HouseholdSettings, { household: householdId } as never);
            await this.em.persist(row).flush();
        }
        const planKey = await this.billing.getPlanKey(householdId);
        return toSettingsDto(row, planKey);
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    async update(
        householdId: string,
        patch: Omit<HouseholdSettingsPatch, 'householdId'>,
        opts?: { allowPaidUpgrade?: boolean; allowStripeBillingSync?: boolean }
    ): Promise<HouseholdSettingsDto> {
        let row = await this.em.findOne(HouseholdSettings, { household: householdId });
        if (!row) {
            row = this.em.create(HouseholdSettings, { household: householdId } as never);
            this.em.persist(row);
        }

        const currentPlan = await this.billing.getPlanKey(householdId);
        const nextPlan = patch.planKey ?? currentPlan;
        const nextKind = patch.kind ?? row.kind;

        if (patch.kind !== undefined && !canUseHouseholdKind(nextPlan, patch.kind)) {
            throw new BadRequestException(
                `${nextPlan} does not allow household kind ${patch.kind}`
            );
        }

        if (patch.planKey !== undefined) {
            if (!opts?.allowPaidUpgrade && !opts?.allowStripeBillingSync) {
                this.assertClientPlanChangeAllowed(currentPlan, patch.planKey);
            }
            // Stripe is billing source of truth — skip seat/kind fit on cancel/sync
            // so multi-member households can downgrade to Basic without blocking the webhook.
            if (!opts?.allowStripeBillingSync) {
                const memberCount = await this.em.count(AuthMember, { household: householdId });
                if (!householdFitsPlan(patch.planKey, { memberCount, kind: nextKind })) {
                    const caps = capabilitiesFor(patch.planKey);
                    throw new BadRequestException(
                        caps.maxMembers !== null && memberCount > caps.maxMembers
                            ? `Cannot switch to ${patch.planKey}: household has ${memberCount} members (max ${caps.maxMembers})`
                            : `Cannot switch to ${patch.planKey}: household kind ${nextKind} is not allowed`
                    );
                }
            }
        }

        if (patch.why !== undefined) row.why = patch.why;
        if (patch.kind !== undefined) row.kind = patch.kind;
        if (patch.currency !== undefined) row.currency = patch.currency;
        if (patch.money) {
            row.moneySettings = { ...row.moneySettings, ...patch.money };
        }
        if (patch.weekCheck) {
            row.weekCheckSettings = { ...row.weekCheckSettings, ...patch.weekCheck };
        }
        if (patch.features) {
            row.featureSettings = { ...row.featureSettings, ...patch.features };
        }
        if (patch.answers) {
            row.answers = { ...row.answers, ...patch.answers };
        }

        await this.em.flush();

        if (patch.planKey !== undefined) {
            await this.billing.setPlanKey(householdId, patch.planKey);
        }

        const planKey = await this.billing.getPlanKey(householdId);
        return toSettingsDto(row, planKey);
    }

    /**
     * When Stripe is live, plan changes must not go through updateSettings:
     * upgrades → Checkout / in-place proration; downgrades → schedulePlanChange.
     */
    private assertClientPlanChangeAllowed(from: PlanKey, to: PlanKey): void {
        const bypass = this.config.get('BILLING_PREVIEW_BYPASS', { infer: true });
        const stripeKey = this.config.get('STRIPE_SECRET_KEY', { infer: true });
        if (bypass || !stripeKey) return;
        if (from === to) return;
        if (PLAN_RANK[to] > PLAN_RANK[from]) {
            throw new ServiceUnavailableException(
                'Paid upgrades require Stripe Checkout — use billing.createCheckoutSession'
            );
        }
        throw new ServiceUnavailableException(
            'Plan downgrades take effect at period end — use billing.schedulePlanChange'
        );
    }
}

function toSettingsDto(row: HouseholdSettings, planKey: PlanKey): HouseholdSettingsDto {
    return {
        householdId: row.household,
        why: row.why,
        kind: row.kind,
        currency: row.currency,
        planKey,
        money: {
            ...DEFAULT_MONEY_SETTINGS,
            ...row.moneySettings,
        },
        weekCheck: {
            ...DEFAULT_WEEK_CHECK_SETTINGS,
            ...row.weekCheckSettings,
        },
        features: {
            ...DEFAULT_FEATURE_SETTINGS,
            ...row.featureSettings,
        },
        answers: row.answers ?? {},
        onboardedAt: row.onboardedAt ? row.onboardedAt.toISOString() : null,
    };
}
