import { z } from 'zod';
import { Id, HouseholdId, WeekKey } from '../../../../common/schemas';

export const Gratitude = z.object({
    id: Id,
    householdId: HouseholdId,
    /** Rumtelo `auth.account.id` — person who wrote the entry (not Better Auth user). */
    accountId: Id,
    week: WeekKey,
    text: z.string().min(1).max(280),
    createdAt: z.iso.datetime(),
});
export type Gratitude = z.infer<typeof Gratitude>;
