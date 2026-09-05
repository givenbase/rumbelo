import { z } from 'zod';

import { HouseholdKind, PlanKey } from '../../enums';

/**
 * What a product tier is allowed to do.
 * Source of truth for gating — app + API always check these helpers.
 *
 * maxMembers: null = unlimited (Max).
 */
export const PlanCapabilities = z.object({
    /** Ceiling on household members (owner included). null = unlimited. */
    maxMembers: z.number().int().positive().nullable(),
    /** Household shapes this tier may use. Basic = solo only. */
    householdKinds: z.array(z.enum(HouseholdKind)).min(1),
    /** Screen keys unlocked on this tier (and below via inheritance in PLAN_CAPABILITIES). */
    screens: z.array(z.string()),
    /** Whether invites / multi-person boards are allowed. */
    canInvite: z.boolean(),
});
export type PlanCapabilities = z.infer<typeof PlanCapabilities>;

const PLUS_SCREENS = ['debt', 'week', 'goals'] as const;
const MAX_SCREENS = [...PLUS_SCREENS, 'income', 'board', 'learn', 'chakra'] as const;

const ALL_KINDS = [
    HouseholdKind.SOLO,
    HouseholdKind.PARTNERS,
    HouseholdKind.FAMILY,
    HouseholdKind.FRIENDS,
] as const;

/**
 * Canonical capabilities per plan key.
 * Seed / DB catalog mirrors this; runtime checks import from here.
 */
export const PLAN_CAPABILITIES: Record<PlanKey, PlanCapabilities> = {
    [PlanKey.BASIC]: {
        maxMembers: 1,
        householdKinds: [HouseholdKind.SOLO],
        screens: [],
        canInvite: false,
    },
    [PlanKey.PLUS]: {
        maxMembers: 5,
        householdKinds: [...ALL_KINDS],
        screens: [...PLUS_SCREENS],
        canInvite: true,
    },
    [PlanKey.MAX]: {
        maxMembers: null,
        householdKinds: [...ALL_KINDS],
        screens: [...MAX_SCREENS],
        canInvite: true,
    },
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

/** Screens that require a paid/higher tier somewhere in the catalog. */
const GATED_SCREENS = new Set(
    Object.values(PLAN_CAPABILITIES).flatMap(caps => caps.screens)
);

/** True when `plan` may open this screenKey (ungated screens always open). */
export function isScreenUnlocked(screenKey: string | null | undefined, plan: PlanKey): boolean {
    if (!screenKey) return true;
    if (!GATED_SCREENS.has(screenKey)) return true;
    return capabilitiesFor(plan).screens.includes(screenKey);
}

export function isScreenLocked(screenKey: string | null | undefined, plan: PlanKey): boolean {
    return !isScreenUnlocked(screenKey, plan);
}

/** Lowest plan that unlocks a screen — used for upgrade CTAs. */
export function minPlanForScreen(screenKey: string): PlanKey | null {
    if (!GATED_SCREENS.has(screenKey)) return null;
    const ordered = [PlanKey.BASIC, PlanKey.PLUS, PlanKey.MAX] as const;
    for (const key of ordered) {
        if (PLAN_CAPABILITIES[key].screens.includes(screenKey)) return key;
    }
    return null;
}

export function canInviteOnPlan(plan: PlanKey): boolean {
    return capabilitiesFor(plan).canInvite;
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

export const PlanCatalogItem = z.object({
    key: z.enum(PlanKey),
    name: z.string(),
    priceMonthly: z.string(),
    capabilities: PlanCapabilities,
    sortOrder: z.int(),
    isActive: z.boolean(),
});
export type PlanCatalogItem = z.infer<typeof PlanCatalogItem>;
