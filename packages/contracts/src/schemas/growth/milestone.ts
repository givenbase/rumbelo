import { z } from 'zod';
import { Id, IsoDate, Money, HouseholdId } from '../common.js';

export const IncomeMilestone = z.object({
    id: Id,
    householdId: HouseholdId,
    label: z.string().min(1).max(160),
    targetMonthly: Money,
    reachedOn: IsoDate.nullable(),
});
export type IncomeMilestone = z.infer<typeof IncomeMilestone>;
