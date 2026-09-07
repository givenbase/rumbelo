import { PlanKey } from '@rumbelo/contracts';

/** Stable Stripe lookup keys — same string in test + live after seeding each account. */
export const STRIPE_PLAN_LOOKUP_KEYS = {
    [PlanKey.PLUS]: {
        month: 'rumbelo_plus_monthly',
        year: 'rumbelo_plus_yearly',
    },
    [PlanKey.MAX]: {
        month: 'rumbelo_max_monthly',
        year: 'rumbelo_max_yearly',
    },
} as const;

export type PaidPlanKey = typeof PlanKey.PLUS | typeof PlanKey.MAX;
export type BillingInterval = 'month' | 'year';

/** Catalog used by the Stripe seed CLI (and display fallbacks). Amounts in major units. */
export const STRIPE_PLAN_CATALOG: Record<
    PaidPlanKey,
    {
        name: string;
        description: string;
        currency: 'eur';
        month: number;
        /** Yearly = 10× monthly (2 months free). */
        year: number;
    }
> = {
    [PlanKey.PLUS]: {
        name: 'Rumbelo Plus',
        description:
            'Share the board with family or friends — debt, energy week, and goals.',
        currency: 'eur',
        month: 9,
        year: 90,
    },
    [PlanKey.MAX]: {
        name: 'Rumbelo Max',
        description:
            'Unlimited household, income curve, learning, and net worth.',
        currency: 'eur',
        month: 19,
        year: 190,
    },
};

export function stripeLookupKey(planKey: PaidPlanKey, interval: BillingInterval): string {
    return STRIPE_PLAN_LOOKUP_KEYS[planKey][interval];
}

const LOOKUP_TO_PLAN: Record<string, PaidPlanKey> = {
    [STRIPE_PLAN_LOOKUP_KEYS[PlanKey.PLUS].month]: PlanKey.PLUS,
    [STRIPE_PLAN_LOOKUP_KEYS[PlanKey.PLUS].year]: PlanKey.PLUS,
    [STRIPE_PLAN_LOOKUP_KEYS[PlanKey.MAX].month]: PlanKey.MAX,
    [STRIPE_PLAN_LOOKUP_KEYS[PlanKey.MAX].year]: PlanKey.MAX,
};

/** Map a Stripe Price `lookup_key` → Plus / Max (null if unknown). */
export function planKeyFromStripeLookupKey(lookupKey: string | null | undefined): PaidPlanKey | null {
    if (!lookupKey) return null;
    return LOOKUP_TO_PLAN[lookupKey] ?? null;
}
