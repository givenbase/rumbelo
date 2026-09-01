import { z } from 'zod';
import { Id, UserId, HouseholdId, WeekKey } from '../common.js';

export const Gratitude = z.object({
    id: Id,
    householdId: HouseholdId,
    userId: UserId,
    week: WeekKey,
    text: z.string().min(1).max(280),
    createdAt: z.iso.datetime(),
});
export type Gratitude = z.infer<typeof Gratitude>;
