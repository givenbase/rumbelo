import { z } from 'zod';

import { JarKey } from '../../enums';
import { HouseholdId, Id, Money, PeriodKey } from '../common';

export { JarKey } from '../../enums';

/** T. Harv Eker's canonical split — the onboarding default, fully user-overridable. */
export const DEFAULT_JAR_SPLIT: Record<JarKey, number> = {
    [JarKey.NECESSITIES]: 55,
    [JarKey.FINANCIAL_FREEDOM]: 10,
    [JarKey.LONG_TERM_SAVINGS]: 10,
    [JarKey.EDUCATION]: 10,
    [JarKey.PLAY]: 10,
    [JarKey.GIVE]: 5,
};

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
    /** Financial Freedom is never spendable — it may only be invested out. */
    isSpendable: z.boolean().default(true),
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
