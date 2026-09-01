import { z } from 'zod';
import { Id, Money, HouseholdId } from '../common.js';

/** Things that move earning power. A Growth surface, not a budget line. */
export const IncomeLever = z.object({
  id: Id,
  householdId: HouseholdId,
  label: z.string().min(1).max(160),
  note: z.string().max(500).nullable(),
  potentialMonthly: Money,
  done: z.boolean(),
});
export type IncomeLever = z.infer<typeof IncomeLever>;
