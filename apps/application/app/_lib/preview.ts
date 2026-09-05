/**
 * Design / demo preview switches (app only — NEXT_PUBLIC_*).
 *
 * PREVIEW_MODE  — force empty fallbacks (no live API) even when a household exists
 * PREVIEW_PLAN  — override plan gating (BASIC | PLUS | MAX | ALL | FULL)
 *
 * Production / normal local: leave both unset so household planKey drives gating.
 */

import { PlanKey } from '@rumbelo/contracts';

import { env } from '@/app/_utils/get-env';

export type PreviewPlanKey = PlanKey;

function parsePlan(value: (typeof env)['NEXT_PUBLIC_PREVIEW_PLAN']): PreviewPlanKey | null {
    if (!value) return null;
    if (value === PlanKey.BASIC || value === PlanKey.PLUS || value === PlanKey.MAX) return value;
    // ALL / FULL = design preview “see every artboard” (not the Max product tier alone)
    if (value === 'ALL' || value === 'FULL') return PlanKey.MAX;
    return null;
}

/** When true, screens prefer mock/fixture data over the API. */
export const PREVIEW_MODE = env.NEXT_PUBLIC_PREVIEW_MODE === 'true';

/** Explicit plan override for gating; null = no override from this var alone. */
export const PREVIEW_PLAN = parsePlan(env.NEXT_PUBLIC_PREVIEW_PLAN);

/**
 * Effective plan for the shell.
 * - PREVIEW_PLAN wins when set
 * - else PREVIEW_MODE alone defaults to MAX (see every artboard)
 * - else fallback (household settings / DEFAULT_PLAN)
 */
export function resolvePreviewPlan(fallback: PreviewPlanKey = PlanKey.BASIC): PreviewPlanKey {
    if (PREVIEW_PLAN) return PREVIEW_PLAN;
    if (PREVIEW_MODE) return PlanKey.MAX;
    return fallback;
}

/**
 * Whether list/detail screens should call the live API.
 * Preview mode always stays on fixtures so fidelity work is stable.
 */
export function isLiveData(householdId: string | null | undefined): boolean {
    if (PREVIEW_MODE) return false;
    return Boolean(householdId);
}
