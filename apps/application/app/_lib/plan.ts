import { PlanKey } from '@rumbelo/contracts';

/**
 * Plan-gating model.
 *
 * Three tiers in ascending order:
 *   BASIC → Basic (entry; €0 today, may become a small paid tier later)
 *   PLUS  → Plus (debt / week / goals)
 *   MAX   → Max (income / board / learn / chakra)
 */

export { PlanKey };

/** @deprecated alias — prefer PlanKey */
export type PlanId = PlanKey;

/** Numeric rank so `BASIC < PLUS < MAX` comparisons stay one expression. */
export const PLAN_RANK: Record<PlanKey, number> = {
    [PlanKey.BASIC]: 0,
    [PlanKey.PLUS]: 1,
    [PlanKey.MAX]: 2,
};

/**
 * Minimum plan required to open a screen.
 * Key = the `screenKey` field on nav children.
 * Absence → screen is accessible on every plan.
 */
export const SCREEN_MIN: Record<string, PlanKey> = {
    debt: PlanKey.PLUS,
    week: PlanKey.PLUS,
    goals: PlanKey.PLUS,
    income: PlanKey.MAX,
    board: PlanKey.MAX,
    learn: PlanKey.MAX,
    chakra: PlanKey.MAX,
};

/** Human-readable plan labels (product names). */
export const PLAN_LABELS: Record<PlanKey, string> = {
    [PlanKey.BASIC]: 'Basic',
    [PlanKey.PLUS]: 'Plus',
    [PlanKey.MAX]: 'Max',
};

/** Fallback when household settings have not loaded yet. */
export const DEFAULT_PLAN: PlanKey = PlanKey.BASIC;

/** Returns true when `plan` is insufficient to access the given screenKey. */
export function isScreenLocked(screenKey: string | null, plan: PlanKey = DEFAULT_PLAN): boolean {
    if (!screenKey) return false;
    const min = SCREEN_MIN[screenKey];
    if (!min) return false;
    return PLAN_RANK[plan] < PLAN_RANK[min];
}

export const LOCK_COPY: Record<
    string,
    { title: string; line: string; planName: string; price: string; cta: string }
> = {
    debt: {
        title: 'Debt belongs in Plus',
        line: 'A debt plan with interest, payoff order, and a freedom date — plus bank connection — is in Plus.',
        planName: 'Plus',
        price: '€9 / month',
        cta: 'Upgrade to Plus',
    },
    week: {
        title: 'Your week belongs in Plus',
        line: 'Divide 168 hours, sleep, training, and food — the floor under every money decision.',
        planName: 'Plus',
        price: '€9 / month',
        cta: 'Upgrade to Plus',
    },
    goals: {
        title: 'Goals belong in Plus',
        line: 'Goals with a date, jar, and progress — in Plus. Income, learning, and net worth are in Max.',
        planName: 'Plus',
        price: '€9 / month',
        cta: 'Upgrade to Plus',
    },
    income: {
        title: 'Income belongs in Max',
        line: 'Your income curve, levers, and growth targets — in Max.',
        planName: 'Max',
        price: '€19 / month',
        cta: 'Upgrade to Max',
    },
    board: {
        title: 'Net worth belongs in Max',
        line: 'Net worth, returns, and your freedom number — in Max.',
        planName: 'Max',
        price: '€19 / month',
        cta: 'Upgrade to Max',
    },
    learn: {
        title: 'Learning belongs in Max',
        line: 'Books, insights, and what they changed — in Max.',
        planName: 'Max',
        price: '€19 / month',
        cta: 'Upgrade to Max',
    },
    chakra: {
        title: 'Centres belong in Plus',
        line: 'The seven centres and where energy gets stuck — in Plus.',
        planName: 'Plus',
        price: '€9 / month',
        cta: 'Upgrade to Plus',
    },
    default: {
        title: 'This area belongs on a higher plan',
        line: 'Everything you have already entered stays yours — you only unlock what you need.',
        planName: 'Plus',
        price: '€9 / month',
        cta: 'View plans',
    },
};
