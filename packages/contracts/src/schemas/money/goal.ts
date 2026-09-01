import { z } from 'zod';
import { Id, IsoDate, Money, HouseholdId } from '../common.js';

export const GoalStatus = z.enum(['ACTIVE', 'REACHED', 'PAUSED', 'ARCHIVED']);

export const Goal = z.object({
    id: Id,
    householdId: HouseholdId,
    /** Goals fund from a jar — usually LONG_TERM_SAVINGS or FINANCIAL_FREEDOM. */
    jarId: Id.nullable(),
    name: z.string().min(1).max(120),
    icon: z.string().max(8).nullable(),
    target: Money,
    saved: Money,
    monthlyContribution: Money,
    targetDate: IsoDate.nullable(),
    status: GoalStatus,
    why: z.string().max(500).nullable(),
});
export type Goal = z.infer<typeof Goal>;

export const GoalProjection = z.object({
    goalId: Id,
    /** Month the goal lands at the current contribution rate; null if never. */
    projectedDate: IsoDate.nullable(),
    monthsRemaining: z.int().nullable(),
    onTrack: z.boolean(),
    shortfallPerMonth: Money,
});
