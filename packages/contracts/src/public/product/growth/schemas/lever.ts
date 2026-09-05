import { z } from 'zod';
import { Id, Money, HouseholdId } from '../../../../common/schemas';

/** Things that move earning power. A Growth surface, not a budget line. */
export const IncomeLever = z.object({
    id: Id,
    householdId: HouseholdId,
    label: z.string().min(1).max(160),
    note: z.string().max(500).nullable(),
    potentialMonthly: Money,
    isDone: z.boolean(),
    /** Optional link back to the catalog preset key. */
    presetKey: z.string().max(64).nullable().optional(),
});
export type IncomeLever = z.infer<typeof IncomeLever>;
