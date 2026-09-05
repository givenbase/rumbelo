/**
 * Design / demo preview switches (app only — NEXT_PUBLIC_*).
 *
 * PREVIEW_MODE  — force design fixtures even when a household exists
 * PREVIEW_PLAN  — override plan gating (GRIP | RITME | GROEI | all)
 *
 * Production: leave both unset. Values come from `@/app/_utils/get-env`.
 */

import { PlanKey } from '@rumbelo/contracts';

import { env } from '@/app/_utils/get-env';

export type PreviewPlanKey = PlanKey;

function parsePlan(value: (typeof env)['NEXT_PUBLIC_PREVIEW_PLAN']): PreviewPlanKey | null {
    if (!value) return null;
    if (value === PlanKey.GRIP || value === PlanKey.RITME || value === PlanKey.GROEI) return value;
    if (value === 'ALL' || value === 'MAX' || value === 'FULL') return PlanKey.GROEI;
    return null;
}

/** When true, screens prefer mock/fixture data over the API. */
export const PREVIEW_MODE = env.NEXT_PUBLIC_PREVIEW_MODE === 'true';

/** Explicit plan override for gating; null = no override from this var alone. */
export const PREVIEW_PLAN = parsePlan(env.NEXT_PUBLIC_PREVIEW_PLAN);

/**
 * Effective plan for the shell.
 * - PREVIEW_PLAN wins when set
 * - else PREVIEW_MODE alone defaults to GROEI (see every artboard)
 * - else fallback (billing / MOCK_PLAN)
 */
export function resolvePreviewPlan(fallback: PreviewPlanKey = PlanKey.GRIP): PreviewPlanKey {
    if (PREVIEW_PLAN) return PREVIEW_PLAN;
    if (PREVIEW_MODE) return PlanKey.GROEI;
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
