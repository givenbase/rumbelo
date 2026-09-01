/**
 * Design / demo preview switches (app only — NEXT_PUBLIC_*).
 *
 * PREVIEW_MODE  — force design fixtures even when a household exists
 * PREVIEW_PLAN  — override plan gating (grip | ritme | groei | all)
 *
 * Production: leave both unset. Values come from `@/app/_utils/get-env`.
 */

import { env } from '@/app/_utils/get-env';

export type PreviewPlanKey = 'grip' | 'ritme' | 'groei';

function parsePlan(value: (typeof env)['NEXT_PUBLIC_PREVIEW_PLAN']): PreviewPlanKey | null {
    if (!value) return null;
    if (value === 'grip' || value === 'ritme' || value === 'groei') return value;
    if (value === 'all' || value === 'max' || value === 'full') return 'groei';
    return null;
}

/** When true, screens prefer mock/fixture data over the API. */
export const PREVIEW_MODE = env.NEXT_PUBLIC_PREVIEW_MODE === 'true';

/** Explicit plan override for gating; null = no override from this var alone. */
export const PREVIEW_PLAN = parsePlan(env.NEXT_PUBLIC_PREVIEW_PLAN);

/**
 * Effective plan for the shell.
 * - PREVIEW_PLAN wins when set
 * - else PREVIEW_MODE alone defaults to groei (see every artboard)
 * - else fallback (billing / MOCK_PLAN)
 */
export function resolvePreviewPlan(fallback: PreviewPlanKey = 'grip'): PreviewPlanKey {
    if (PREVIEW_PLAN) return PREVIEW_PLAN;
    if (PREVIEW_MODE) return 'groei';
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
