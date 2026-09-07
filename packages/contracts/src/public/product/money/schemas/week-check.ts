import { z } from 'zod';

import { WeekCheckStage } from '../../../../enums';
import { HouseholdId, Id, Money, WeekKey } from '../../../../common/schemas';

export { WeekCheckStage } from '../../../../enums';

/**
 * The ten-minute weekly week check: look, redirect, set intention.
 * Deliberately three steps — the product's core claim is that this beats daily worry.
 */
export const WeekCheckAllocation = z.object({
    jarId: Id,
    amount: Money,
});

export const WeekCheck = z.object({
    id: Id,
    householdId: HouseholdId,
    week: WeekKey,
    stage: z.enum(WeekCheckStage),
    surplus: Money,
    allocations: z.array(WeekCheckAllocation),
    /** The single sentence the user commits to for the coming week. */
    intention: z.string().max(280).nullable(),
    completedAt: z.iso.datetime().nullable(),
});
export type WeekCheck = z.infer<typeof WeekCheck>;
