import { normalizeAppPathname, resolveNavChildForPath } from './nav';
import { minPlanForCapability, type PlanKey } from './plan';

/**
 * Routes that are not nav children but inherit a gated capability.
 * Empty for now — create flows live under their parent nav routes.
 */
const CAPABILITY_PATH_ALIASES: ReadonlyArray<{ prefix: string; capabilityKey: string }> = [];

/** Resolve the plan-gating capability key for any app pathname. */
export function capabilityKeyForPathname(pathname: string): string | null {
    const path = normalizeAppPathname(pathname);
    const alias = CAPABILITY_PATH_ALIASES.filter(
        entry => path === entry.prefix || path.startsWith(`${entry.prefix}/`)
    ).sort((left, right) => right.prefix.length - left.prefix.length)[0];
    if (alias) return alias.capabilityKey;

    return resolveNavChildForPath(path)?.capabilityKey ?? null;
}

export interface CapabilityAccess {
    capabilityKey: string | null;
    locked: boolean;
    requiredPlan: PlanKey | null;
}

/** Evaluate whether the current path is allowed for `plan`. */
export function capabilityAccessForPath(
    pathname: string,
    plan: PlanKey,
    isLocked: (capabilityKey: string | null, plan: PlanKey) => boolean
): CapabilityAccess {
    const capabilityKey = capabilityKeyForPathname(pathname);
    const locked = isLocked(capabilityKey, plan);
    const requiredPlan = capabilityKey ? minPlanForCapability(capabilityKey) : null;
    return { capabilityKey, locked, requiredPlan };
}
