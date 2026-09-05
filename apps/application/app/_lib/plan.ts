import {
    PlanKey,
    PLAN_CAPABILITIES,
    PLAN_RANK,
    capabilitiesFor,
    isScreenLocked as isScreenLockedByCaps,
    minPlanForScreen,
} from '@rumbelo/contracts';

/**
 * Plan-gating model — delegates to contracts PLAN_CAPABILITIES.
 *
 *   BASIC → solo only, 1 member, base screens
 *   PLUS  → up to 5 members, any household kind, debt / week / goals
 *   MAX   → unlimited members, full screen set
 */

export { PlanKey, PLAN_CAPABILITIES, PLAN_RANK, capabilitiesFor, minPlanForScreen };

/** @deprecated alias — prefer PlanKey */
export type PlanId = PlanKey;

/** Human-readable plan labels (product names). */
export const PLAN_LABELS: Record<PlanKey, string> = {
    [PlanKey.BASIC]: 'Basic',
    [PlanKey.PLUS]: 'Plus',
    [PlanKey.MAX]: 'Max',
};

/** Fallback when household settings have not loaded yet. */
export const DEFAULT_PLAN: PlanKey = PlanKey.BASIC;

/**
 * Minimum plan required to open a screen (derived from capabilities).
 * Absence → screen is accessible on every plan.
 */
export const SCREEN_MIN: Record<string, PlanKey> = Object.fromEntries(
    [...new Set(Object.values(PLAN_CAPABILITIES).flatMap(c => c.screens))].map(screen => [
        screen,
        minPlanForScreen(screen)!,
    ])
) as Record<string, PlanKey>;

/** Returns true when `plan` is insufficient to access the given screenKey. */
export function isScreenLocked(screenKey: string | null, plan: PlanKey = DEFAULT_PLAN): boolean {
    return isScreenLockedByCaps(screenKey, plan);
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
        title: 'Centres belong in Max',
        line: 'The seven centres and where energy gets stuck — in Max.',
        planName: 'Max',
        price: '€19 / month',
        cta: 'Upgrade to Max',
    },
    invite: {
        title: 'Shared households belong in Plus',
        line: 'Basic is for one person. Invite a partner, family, or friend on Plus (up to 5) or Max (unlimited).',
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

export function memberLimitLabel(plan: PlanKey): string {
    const max = capabilitiesFor(plan).maxMembers;
    if (max === null) return 'Unlimited members';
    if (max === 1) return '1 member (solo)';
    return `Up to ${max} members`;
}
