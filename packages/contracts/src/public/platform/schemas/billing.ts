import { z } from 'zod';

import { PlanKey } from '../../../enums';

/** Display fields from `stripe.prices.retrieve` (plus expanded product name). */
export const BillingPriceDisplay = z.object({
    priceId: z.string(),
    /** Stripe `unit_amount` in the smallest currency unit (e.g. cents). */
    amountCents: z.number().int().nonnegative(),
    currency: z.string(),
    /** Price nickname, else Product name, else null. */
    label: z.string().nullable(),
});
export type BillingPriceDisplay = z.infer<typeof BillingPriceDisplay>;

/** Household commercial snapshot for plan UI (period-end cancel / downgrade). */
export const HouseholdBillingStatus = z.object({
    stripeEnabled: z.boolean(),
    previewBypass: z.boolean(),
    planKey: z.enum(PlanKey),
    /** ISO when current paid period ends; null on Basic / unknown. */
    periodEndsAt: z.iso.datetime().nullable(),
    periodStartedAt: z.iso.datetime().nullable(),
    /** True when subscription cancels to Basic at {@link periodEndsAt}. */
    isCancelAtPeriodEnd: z.boolean(),
    /**
     * Plan that takes effect at period end (Basic cancel, or Max→Plus).
     * Null when no change is scheduled.
     */
    scheduledPlanKey: z.enum(PlanKey).nullable(),
    /** Stripe Customer exists (or will be created) for Customer Portal. */
    hasStripeCustomer: z.boolean(),
    /** Active Stripe subscription id is stored (paid tier). */
    hasActiveSubscription: z.boolean(),
    prices: z
        .object({
            PLUS: z.object({
                month: BillingPriceDisplay.nullable(),
                year: BillingPriceDisplay.nullable(),
            }),
            MAX: z.object({
                month: BillingPriceDisplay.nullable(),
                year: BillingPriceDisplay.nullable(),
            }),
        })
        .nullable(),
});
export type HouseholdBillingStatus = z.infer<typeof HouseholdBillingStatus>;
