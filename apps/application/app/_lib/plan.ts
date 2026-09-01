/**
 * Plan-gating model — mirrors design `PLANS` block.
 *
 * Three tiers in ascending order:
 *   grip  → Grip (starter, free)
 *   ritme → Engine (unlock debt / week / goals screens)
 *   groei → Compound (unlock income / board / learn / chakra screens)
 */

export type PlanKey = 'grip' | 'ritme' | 'groei';

/** @deprecated alias — prefer PlanKey */
export type PlanId = PlanKey;

/** Numeric rank so `grip < ritme < groei` comparisons stay one expression. */
export const PLAN_RANK: Record<PlanKey, number> = {
  grip: 0,
  ritme: 1,
  groei: 2,
};

/**
 * Minimum plan required to open a screen.
 * Key = the `screenKey` field on nav children.
 * Absence → screen is accessible on every plan.
 */
export const SCREEN_MIN: Record<string, PlanKey> = {
  debt:   'ritme',
  week:   'ritme',
  goals:  'ritme',
  income: 'groei',
  board:  'groei',
  learn:  'groei',
  chakra: 'groei',
};

/** Human-readable plan labels (product names). */
export const PLAN_LABELS: Record<PlanKey, string> = {
  grip:   'Grip',
  ritme:  'Engine',
  groei:  'Compound',
};

/** Active plan when billing is not wired — preview env can raise this via the shell. */
export const MOCK_PLAN: PlanKey = 'grip';

/** Returns true when `plan` is insufficient to access the given screenKey. */
export function isScreenLocked(screenKey: string | null, plan: PlanKey = MOCK_PLAN): boolean {
  if (!screenKey) return false;
  const min = SCREEN_MIN[screenKey];
  if (!min) return false;
  return PLAN_RANK[plan] < PLAN_RANK[min];
}

export const LOCK_COPY: Record<string, { title: string; line: string; planName: string; price: string; cta: string }> = {
  debt: {
    title: 'Debt belongs in Engine',
    line: 'A debt plan with interest, payoff order, and a freedom date — plus bank connection — is in Engine.',
    planName: 'Engine',
    price: '€9 / month',
    cta: 'Upgrade to Engine',
  },
  week: {
    title: 'Your week belongs in Engine',
    line: 'Divide 168 hours, sleep, training, and food — the floor under every money decision.',
    planName: 'Engine',
    price: '€9 / month',
    cta: 'Upgrade to Engine',
  },
  goals: {
    title: 'Goals belong in Compound',
    line: 'Goals with a date, jar, and progress — plus income, learning, and net worth — are in Compound.',
    planName: 'Compound',
    price: '€19 / month',
    cta: 'Upgrade to Compound',
  },
  income: {
    title: 'Income belongs in Compound',
    line: 'Your income curve, levers, and growth targets — in Compound.',
    planName: 'Compound',
    price: '€19 / month',
    cta: 'Upgrade to Compound',
  },
  board: {
    title: 'Net worth belongs in Compound',
    line: 'Net worth, returns, and your freedom number — in Compound.',
    planName: 'Compound',
    price: '€19 / month',
    cta: 'Upgrade to Compound',
  },
  learn: {
    title: 'Learning belongs in Compound',
    line: 'Books, insights, and what they changed — in Compound.',
    planName: 'Compound',
    price: '€19 / month',
    cta: 'Upgrade to Compound',
  },
  chakra: {
    title: 'Centres belong in Engine',
    line: 'The seven centres and where energy gets stuck — in Engine.',
    planName: 'Engine',
    price: '€9 / month',
    cta: 'Upgrade to Engine',
  },
  default: {
    title: 'This area belongs on a higher plan',
    line: 'Everything you have already entered stays yours — you only unlock what you need.',
    planName: 'Engine',
    price: '€9 / month',
    cta: 'View plans',
  },
};
