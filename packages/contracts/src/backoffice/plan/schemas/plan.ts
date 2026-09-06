import { z } from 'zod';

import { HouseholdKind } from '../../../enums';
import {
    CAPABILITIES,
    CAPABILITY_KEYS,
    CAPABILITY_PRODUCTS,
    CapabilityProduct,
    isCapabilityKey,
    productOfCapability,
    type CapabilityKey,
} from '../capabilities';
import { CapabilityKind, PlanKey } from '../enums';

/**
 * What a product tier is allowed to do.
 *
 * Mental model (read top-down):
 *   plan → product → features
 *   e.g. Max → growth → [goals, income, board, learn]
 *
 * Source of truth for nested grants: PLAN_ACCESS.
 * Flat list PLAN_CAPABILITY_GRANTS is derived for simple checks.
 */

export const PlanCapabilities = z.object({
    /** Ceiling on household members (owner included). null = unlimited. */
    maxMembers: z.number().int().positive().nullable(),
    /** Household shapes this tier may use. Basic = solo only. */
    householdKinds: z.array(z.enum(HouseholdKind)).min(1),
    /** Flat capability keys granted on this tier (derived from PLAN_ACCESS). */
    capabilityKeys: z.array(z.enum(CAPABILITY_KEYS)),
    /** Whether invites are allowed (mirrors platform-invite). */
    canInvite: z.boolean(),
});
export type PlanCapabilities = z.infer<typeof PlanCapabilities>;

/** Catalog metadata for each capability key (seed / Settings / docs). */
export const CapabilityDefinition = z.object({
    key: z.enum(CAPABILITY_KEYS),
    kind: z.enum(CapabilityKind),
    name: z.string(),
    description: z.string(),
    sortOrder: z.int(),
});
export type CapabilityDefinition = z.infer<typeof CapabilityDefinition>;

export const CAPABILITY_CATALOG: Record<CapabilityKey, CapabilityDefinition> = {
    [CAPABILITIES.moneyDebt]: {
        key: CAPABILITIES.moneyDebt,
        kind: CapabilityKind.SCREEN,
        name: 'Debt',
        description: 'Debt plan with interest, payoff order, and freedom date.',
        sortOrder: 10,
    },
    [CAPABILITIES.energyWeek]: {
        key: CAPABILITIES.energyWeek,
        kind: CapabilityKind.SCREEN,
        name: 'Week',
        description: 'Divide 168 hours — sleep, training, and food.',
        sortOrder: 20,
    },
    [CAPABILITIES.growthGoals]: {
        key: CAPABILITIES.growthGoals,
        kind: CapabilityKind.SCREEN,
        name: 'Goals',
        description: 'Goals with a date, jar, and progress.',
        sortOrder: 30,
    },
    [CAPABILITIES.growthIncome]: {
        key: CAPABILITIES.growthIncome,
        kind: CapabilityKind.SCREEN,
        name: 'Income',
        description: 'Income curve, levers, and growth targets.',
        sortOrder: 40,
    },
    [CAPABILITIES.growthBoard]: {
        key: CAPABILITIES.growthBoard,
        kind: CapabilityKind.SCREEN,
        name: 'Net worth',
        description: 'Net worth, returns, and your freedom number.',
        sortOrder: 50,
    },
    [CAPABILITIES.growthLearn]: {
        key: CAPABILITIES.growthLearn,
        kind: CapabilityKind.SCREEN,
        name: 'Learn',
        description: 'Books, insights, and what they changed.',
        sortOrder: 60,
    },
    [CAPABILITIES.soulChakra]: {
        key: CAPABILITIES.soulChakra,
        kind: CapabilityKind.SCREEN,
        name: 'Centres',
        description: 'The seven centres and where energy gets stuck.',
        sortOrder: 70,
    },
    [CAPABILITIES.platformInvite]: {
        key: CAPABILITIES.platformInvite,
        kind: CapabilityKind.ACTION,
        name: 'Invite',
        description: 'Invite a partner, family, or friend to the household.',
        sortOrder: 80,
    },
};

/** Ordered list for seed / admin UIs. */
export const CAPABILITY_DEFINITIONS: readonly CapabilityDefinition[] = Object.values(
    CAPABILITY_CATALOG
).sort((left, right) => left.sortOrder - right.sortOrder);

type ProductFeatureMap = Record<CapabilityProduct, readonly CapabilityKey[]>;

/**
 * Plan → product → features.
 *
 * This is the readable grant table. Example:
 *   Plus → growth → [growth-goals]
 *   Max  → growth → [growth-goals, growth-income, growth-board, growth-learn]
 *
 * Portal hubs (money/growth/energy/soul overviews) stay open on every plan;
 * only listed features are gated.
 */
export const PLAN_ACCESS: Record<PlanKey, ProductFeatureMap> = {
    [PlanKey.BASIC]: {
        [CapabilityProduct.MONEY]: [],
        [CapabilityProduct.GROWTH]: [],
        [CapabilityProduct.ENERGY]: [],
        [CapabilityProduct.SOUL]: [],
        [CapabilityProduct.PLATFORM]: [],
    },
    [PlanKey.PLUS]: {
        [CapabilityProduct.MONEY]: [CAPABILITIES.moneyDebt],
        [CapabilityProduct.GROWTH]: [CAPABILITIES.growthGoals],
        [CapabilityProduct.ENERGY]: [CAPABILITIES.energyWeek],
        [CapabilityProduct.SOUL]: [],
        [CapabilityProduct.PLATFORM]: [CAPABILITIES.platformInvite],
    },
    [PlanKey.MAX]: {
        [CapabilityProduct.MONEY]: [CAPABILITIES.moneyDebt],
        [CapabilityProduct.GROWTH]: [
            CAPABILITIES.growthGoals,
            CAPABILITIES.growthIncome,
            CAPABILITIES.growthBoard,
            CAPABILITIES.growthLearn,
        ],
        [CapabilityProduct.ENERGY]: [CAPABILITIES.energyWeek],
        [CapabilityProduct.SOUL]: [CAPABILITIES.soulChakra],
        [CapabilityProduct.PLATFORM]: [CAPABILITIES.platformInvite],
    },
};

/** Flat grant list derived from PLAN_ACCESS — used by hasCapability / seeders. */
export const PLAN_CAPABILITY_GRANTS: Record<PlanKey, readonly CapabilityKey[]> = {
    [PlanKey.BASIC]: flattenAccess(PlanKey.BASIC),
    [PlanKey.PLUS]: flattenAccess(PlanKey.PLUS),
    [PlanKey.MAX]: flattenAccess(PlanKey.MAX),
};

function flattenAccess(plan: PlanKey): CapabilityKey[] {
    return CAPABILITY_PRODUCTS.flatMap(product => [...PLAN_ACCESS[plan][product]]);
}

/** Features granted on `plan` inside one product. */
export function featuresForProduct(
    plan: PlanKey,
    product: CapabilityProduct
): readonly CapabilityKey[] {
    return PLAN_ACCESS[plan][product];
}

/** Products that have at least one granted (gated) feature on this plan. */
export function productsWithGrants(plan: PlanKey): CapabilityProduct[] {
    return CAPABILITY_PRODUCTS.filter(product => PLAN_ACCESS[plan][product].length > 0);
}

/** True when `plan` grants this feature inside its product. */
export function hasProductFeature(
    plan: PlanKey,
    product: CapabilityProduct,
    featureKey: string
): boolean {
    return PLAN_ACCESS[plan][product].includes(featureKey as CapabilityKey);
}

const ALL_KINDS = [
    HouseholdKind.SOLO,
    HouseholdKind.PARTNERS,
    HouseholdKind.FAMILY,
    HouseholdKind.FRIENDS,
] as const;

function buildPlanCapabilities(
    plan: PlanKey,
    limits: { maxMembers: number | null; householdKinds: readonly HouseholdKind[] }
): PlanCapabilities {
    const capabilityKeys = [...PLAN_CAPABILITY_GRANTS[plan]];
    return {
        maxMembers: limits.maxMembers,
        householdKinds: [...limits.householdKinds],
        capabilityKeys,
        canInvite: capabilityKeys.includes(CAPABILITIES.platformInvite),
    };
}

/**
 * Canonical capabilities per plan key (limits + granted keys).
 * Seed / DB catalog mirrors this; runtime checks import from here.
 */
export const PLAN_CAPABILITIES: Record<PlanKey, PlanCapabilities> = {
    [PlanKey.BASIC]: buildPlanCapabilities(PlanKey.BASIC, {
        maxMembers: 1,
        householdKinds: [HouseholdKind.SOLO],
    }),
    [PlanKey.PLUS]: buildPlanCapabilities(PlanKey.PLUS, {
        maxMembers: 5,
        householdKinds: ALL_KINDS,
    }),
    [PlanKey.MAX]: buildPlanCapabilities(PlanKey.MAX, {
        maxMembers: null,
        householdKinds: ALL_KINDS,
    }),
};

/** Tier order for comparisons — mirrors catalog sortOrder (BASIC=0 < PLUS < MAX). */
export const PLAN_RANK: Record<PlanKey, number> = {
    [PlanKey.BASIC]: 0,
    [PlanKey.PLUS]: 1,
    [PlanKey.MAX]: 2,
};

export function capabilitiesFor(plan: PlanKey): PlanCapabilities {
    return PLAN_CAPABILITIES[plan];
}

export function grantsFor(plan: PlanKey): readonly CapabilityKey[] {
    return PLAN_CAPABILITY_GRANTS[plan];
}

/** All keys that require a paid/higher tier somewhere in the catalog. */
const GATED_CAPABILITIES = new Set(Object.values(PLAN_CAPABILITY_GRANTS).flatMap(keys => keys));

/** True when `plan` grants this capability key (unknown / ungated keys always open). */
export function hasCapability(capabilityKey: string | null | undefined, plan: PlanKey): boolean {
    if (!capabilityKey) return true;
    if (!isCapabilityKey(capabilityKey)) return true;
    if (!GATED_CAPABILITIES.has(capabilityKey)) return true;
    return grantsFor(plan).includes(capabilityKey);
}

export function isCapabilityLocked(
    capabilityKey: string | null | undefined,
    plan: PlanKey
): boolean {
    return !hasCapability(capabilityKey, plan);
}

/** Lowest plan that grants a capability — used for upgrade CTAs. */
export function minPlanForCapability(capabilityKey: string): PlanKey | null {
    if (!isCapabilityKey(capabilityKey) || !GATED_CAPABILITIES.has(capabilityKey)) return null;
    const ordered = [PlanKey.BASIC, PlanKey.PLUS, PlanKey.MAX] as const;
    for (const plan of ordered) {
        if (PLAN_CAPABILITY_GRANTS[plan].includes(capabilityKey)) return plan;
    }
    return null;
}

export function canInviteOnPlan(plan: PlanKey): boolean {
    return hasCapability(CAPABILITIES.platformInvite, plan);
}

/**
 * Whether another member seat is available.
 * `occupiedSeats` = current members + pending invites (owner counts as 1).
 */
export function canAddHouseholdMember(plan: PlanKey, occupiedSeats: number): boolean {
    const caps = capabilitiesFor(plan);
    if (!caps.canInvite) return false;
    if (caps.maxMembers === null) return true;
    return occupiedSeats < caps.maxMembers;
}

export function canUseHouseholdKind(plan: PlanKey, kind: HouseholdKind): boolean {
    return capabilitiesFor(plan).householdKinds.includes(kind);
}

/** True when the household already fits under the target plan's caps. */
export function householdFitsPlan(
    plan: PlanKey,
    opts: { memberCount: number; kind: HouseholdKind }
): boolean {
    const caps = capabilitiesFor(plan);
    if (!caps.householdKinds.includes(opts.kind)) return false;
    if (caps.maxMembers !== null && opts.memberCount > caps.maxMembers) return false;
    return true;
}

/** Group a plan's grants back into product → features (same shape as PLAN_ACCESS). */
export function accessTreeFor(plan: PlanKey): ProductFeatureMap {
    return PLAN_ACCESS[plan];
}

/** Which product a capability belongs to (from the key prefix). */
export function productForCapability(key: CapabilityKey): CapabilityProduct {
    return productOfCapability(key);
}

export const PlanCatalogItem = z.object({
    key: z.enum(PlanKey),
    name: z.string(),
    priceMonthly: z.string(),
    capabilities: PlanCapabilities,
    sortOrder: z.int(),
    isActive: z.boolean(),
});
export type PlanCatalogItem = z.infer<typeof PlanCatalogItem>;

/** Link row shape — which plan grants which capability (DB mirror). */
export const PlanCapabilityGrant = z.object({
    planKey: z.enum(PlanKey),
    capabilityKey: z.enum(CAPABILITY_KEYS),
});
export type PlanCapabilityGrant = z.infer<typeof PlanCapabilityGrant>;

/** Flat grant list derived from PLAN_CAPABILITY_GRANTS — used by seeders. */
export const PLAN_CAPABILITY_GRANT_ROWS: readonly PlanCapabilityGrant[] = (
    Object.entries(PLAN_CAPABILITY_GRANTS) as [PlanKey, readonly CapabilityKey[]][]
).flatMap(([planKey, keys]) => keys.map(capabilityKey => ({ planKey, capabilityKey })));
