import { z } from 'zod';

import { JarKey } from '../../../../enums';
import { HouseholdId, Id, Money, PeriodKey } from '../../../../common/schemas';

export { JarKey } from '../../../../enums';

/** T. Harv Eker's canonical split — the onboarding default, fully user-overridable. */
export const DEFAULT_JAR_SPLIT: Record<JarKey, number> = {
    [JarKey.NECESSITIES]: 55,
    [JarKey.FINANCIAL_FREEDOM]: 10,
    [JarKey.LONG_TERM_SAVINGS]: 10,
    [JarKey.EDUCATION]: 10,
    [JarKey.PLAY]: 10,
    [JarKey.GIVE]: 5,
};

/**
 * What a jar may do — identity stays on JarKey; behavior lives here.
 * Seeded from JAR_CAPABILITIES onto templates → household jars at onboard.
 */
export const JarCapabilities = z.object({
    /** Day-to-day expenses / inbox sorting may land here. */
    canSpend: z.boolean(),
    /** Goals and buffers may attach here. */
    canSave: z.boolean(),
    /** Money leaves only as invest / holdings transfer (never day-to-day spend). */
    canInvest: z.boolean(),
    /** Included in dashboard "safe to spend" / play-left maths. */
    countsTowardSafeToSpend: z.boolean(),
});
export type JarCapabilities = z.infer<typeof JarCapabilities>;

const SPEND: JarCapabilities = {
    canSpend: true,
    canSave: false,
    canInvest: false,
    countsTowardSafeToSpend: true,
};

/** Canonical capabilities per jar key — runtime checks import from here. */
export const JAR_CAPABILITIES: Record<JarKey, JarCapabilities> = {
    [JarKey.NECESSITIES]: { ...SPEND },
    [JarKey.PLAY]: { ...SPEND },
    [JarKey.GIVE]: { ...SPEND },
    [JarKey.EDUCATION]: {
        canSpend: true,
        canSave: true,
        canInvest: false,
        countsTowardSafeToSpend: true,
    },
    [JarKey.LONG_TERM_SAVINGS]: {
        canSpend: true,
        canSave: true,
        canInvest: false,
        countsTowardSafeToSpend: false,
    },
    [JarKey.FINANCIAL_FREEDOM]: {
        canSpend: false,
        canSave: false,
        canInvest: true,
        countsTowardSafeToSpend: false,
    },
};

export function jarCapabilitiesFor(key: JarKey): JarCapabilities {
    return JAR_CAPABILITIES[key];
}

export const Category = z.object({
    id: Id,
    jarId: Id,
    name: z.string().min(1).max(80),
    budgeted: Money,
    actual: Money,
    isArchived: z.boolean().default(false),
});
export type Category = z.infer<typeof Category>;

export const Jar = z.object({
    id: Id,
    householdId: HouseholdId,
    key: z.enum(JarKey),
    name: z.string().min(1).max(80),
    subtitle: z.string().max(160).nullable(),
    icon: z.string().max(8).nullable(),
    /** Share of net income routed here on arrival. All jars must sum to 100. */
    percentage: z.number().min(0).max(100),
    capabilities: JarCapabilities,
    sortOrder: z.int(),
});
export type Jar = z.infer<typeof Jar>;

/** A jar as shown on the dashboard for one period, with its money resolved. */
export const JarBalance = Jar.extend({
    period: PeriodKey,
    allocated: Money,
    spent: Money,
    remaining: Money,
    /** remaining/allocated, clamped 0..1; null when nothing was allocated. */
    progress: z.number().min(0).max(1).nullable(),
    overspent: z.boolean(),
    categories: z.array(Category),
});
export type JarBalance = z.infer<typeof JarBalance>;

export const UpdateJarSplit = z.object({
    householdId: HouseholdId,
    split: z.array(z.object({ jarId: Id, percentage: z.number().min(0).max(100) })).min(1),
});
