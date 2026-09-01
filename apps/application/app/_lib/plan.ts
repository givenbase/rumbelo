/**
 * Plan-gating model — mirrors design `PLANS` block.
 *
 * Three tiers in ascending order:
 *   grip  → Grip (starter, free)
 *   ritme → Ritme (unlock debt / week / goals screens)
 *   groei → Groei (unlock income / board / learn / chakra screens)
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

/** Human-readable plan labels (Dutch). */
export const PLAN_LABELS: Record<PlanKey, string> = {
  grip:   'Grip',
  ritme:  'Ritme',
  groei:  'Groei',
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
    title: 'Schulden horen bij Engine',
    line: 'Een schuldenplan met rente, volgorde en een vrijheidsdatum — plus bankkoppeling — zit in Engine.',
    planName: 'Engine',
    price: '€9 / maand',
    cta: 'Upgrade naar Engine',
  },
  week: {
    title: 'Je week hoort bij Engine',
    line: '168 uur verdelen, slaap, training en voeding — de vloer onder elke financiële beslissing.',
    planName: 'Engine',
    price: '€9 / maand',
    cta: 'Upgrade naar Engine',
  },
  goals: {
    title: 'Doelen horen bij Compound',
    line: 'Doelen met datum, pot en voortgang — plus inkomen, leren en vermogen — zit in Compound.',
    planName: 'Compound',
    price: '€19 / maand',
    cta: 'Upgrade naar Compound',
  },
  income: {
    title: 'Inkomen hoort bij Compound',
    line: 'Je inkomenscurve, hefbomen en groeidoelen — zit in Compound.',
    planName: 'Compound',
    price: '€19 / maand',
    cta: 'Upgrade naar Compound',
  },
  board: {
    title: 'Vermogen hoort bij Compound',
    line: 'Net worth, rendement en je vrijheidsgetal — zit in Compound.',
    planName: 'Compound',
    price: '€19 / maand',
    cta: 'Upgrade naar Compound',
  },
  learn: {
    title: 'Leren hoort bij Compound',
    line: 'Boeken, inzichten en wat ze veranderden — zit in Compound.',
    planName: 'Compound',
    price: '€19 / maand',
    cta: 'Upgrade naar Compound',
  },
  chakra: {
    title: 'Centra horen bij Engine',
    line: 'De zeven centra en waar energie vastzit — zit in Engine.',
    planName: 'Engine',
    price: '€9 / maand',
    cta: 'Upgrade naar Engine',
  },
  default: {
    title: 'Deze plek hoort bij een hoger plan',
    line: 'Wat je al hebt ingevuld blijft van jou — je opent alleen wat je nodig hebt.',
    planName: 'Engine',
    price: '€9 / maand',
    cta: 'Bekijk plannen',
  },
};
