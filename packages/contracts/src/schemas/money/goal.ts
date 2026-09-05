import { z } from 'zod';

import { GoalStatus } from '../../enums';
import { HouseholdId, Id, IsoDate, Money } from '../common';

export { GoalStatus } from '../../enums';

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
    targetOn: IsoDate.nullable(),
    status: z.enum(GoalStatus),
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
