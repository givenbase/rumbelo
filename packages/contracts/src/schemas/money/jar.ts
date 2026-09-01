import { z } from 'zod';
import { Id, Money, PeriodKey, HouseholdId } from '../common.js';

/**
 * The six jars. Keys are stable and used as enum values in the database —
 * the display name is user-editable, the key is not.
 */
export const JarKey = z.enum([
  'NECESSITIES',
  'FINANCIAL_FREEDOM',
  'EDUCATION',
  'LONG_TERM_SAVINGS',
  'PLAY',
  'GIVE',
]);
export type JarKey = z.infer<typeof JarKey>;

/** T. Harv Eker's canonical split — the onboarding default, fully user-overridable. */
export const DEFAULT_JAR_SPLIT: Record<JarKey, number> = {
  NECESSITIES: 55,
  FINANCIAL_FREEDOM: 10,
  LONG_TERM_SAVINGS: 10,
  EDUCATION: 10,
  PLAY: 10,
  GIVE: 5,
};

export const Category = z.object({
  id: Id,
  jarId: Id,
  name: z.string().min(1).max(80),
  budgeted: Money,
  actual: Money,
  archived: z.boolean().default(false),
});
export type Category = z.infer<typeof Category>;

export const Jar = z.object({
  id: Id,
  householdId: HouseholdId,
  key: JarKey,
  name: z.string().min(1).max(80),
  subtitle: z.string().max(160).nullable(),
  icon: z.string().max(8).nullable(),
  /** Share of net income routed here on arrival. All jars must sum to 100. */
  percentage: z.number().min(0).max(100),
  /** Financial Freedom is never spendable — it may only be invested out. */
  spendable: z.boolean().default(true),
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
