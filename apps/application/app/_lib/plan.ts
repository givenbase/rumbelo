import {
    CAPABILITIES,
    CAPABILITY_CATALOG,
    FEATURES,
    PLAN_ACCESS,
    PLAN_CAPABILITIES,
    PLAN_CAPABILITY_GRANTS,
    PLAN_RANK,
    PlanKey,
    capabilitiesFor,
    featuresForProduct,
    hasCapability,
    isCapabilityLocked,
    isCapabilityKey,
    minPlanForCapability,
    productsWithGrants,
    type CapabilityKey,
} from '@rumbelo/contracts';

/**
 * Plan gating — plan → product → feature (`{product}-{feature}`).
 *
 *   BASIC → portals open, no gated features
 *   PLUS  → money-debt, energy-week, growth-goals, platform-invite
 *   MAX   → Plus + growth-income/board/learn, soul-chakra
 */

export {
    CAPABILITIES,
    FEATURES,
    PLAN_ACCESS,
    PLAN_CAPABILITIES,
    PLAN_CAPABILITY_GRANTS,
    PLAN_RANK,
    PlanKey,
    capabilitiesFor,
    featuresForProduct,
    hasCapability,
    isCapabilityLocked,
    minPlanForCapability,
    productsWithGrants,
    type CapabilityKey,
};

/** Human-readable plan labels (product names). */
export const PLAN_LABELS: Record<PlanKey, string> = {
    [PlanKey.BASIC]: 'Basic',
    [PlanKey.PLUS]: 'Plus',
    [PlanKey.MAX]: 'Max',
};

/** List price shown on upgrade CTAs. */
export const PLAN_PRICE: Record<PlanKey, string> = {
    [PlanKey.BASIC]: '€0',
    [PlanKey.PLUS]: '€9 / month',
    [PlanKey.MAX]: '€19 / month',
};

/** Fallback when household settings have not loaded yet. */
export const DEFAULT_PLAN: PlanKey = PlanKey.BASIC;

export type LockCopy = {
    line: string;
    planName: string;
    price: string;
    cta: string;
};

const DEFAULT_LOCK_LINE =
    'Everything you have already entered stays yours — you only unlock what you need.';

/**
 * Upgrade wall copy — plan name / price / CTA from `requiredPlan`;
 * body line from CAPABILITY_CATALOG (single source with seed metadata).
 */
export function lockCopyFor(
    capabilityKey: string | null | undefined,
    requiredPlan: PlanKey = PlanKey.PLUS
): LockCopy {
    const planName = PLAN_LABELS[requiredPlan];
    const line =
        capabilityKey && isCapabilityKey(capabilityKey)
            ? CAPABILITY_CATALOG[capabilityKey].description
            : DEFAULT_LOCK_LINE;

    return {
        line,
        planName,
        price: PLAN_PRICE[requiredPlan],
        cta: `Upgrade to ${planName}`,
    };
}

export function memberLimitLabel(plan: PlanKey): string {
    const max = capabilitiesFor(plan).maxMembers;
    if (max === null) return 'Unlimited members';
    if (max === 1) return '1 member (solo)';
    return `Up to ${max} members`;
}
