import { z } from 'zod';
import { Cadence, Id, IsoDate, Money, HouseholdId } from '../common.js';

export const IncomeKind = z.enum(['SALARY', 'FREELANCE', 'BENEFIT', 'RENTAL', 'DIVIDEND', 'OTHER']);

export const IncomeSource = z.object({
  id: Id,
  householdId: HouseholdId,
  name: z.string().min(1).max(120),
  kind: IncomeKind,
  amount: Money,
  cadence: Cadence,
  /** Day of month the money lands; drives the auto-split trigger. */
  expectedDay: z.int().min(1).max(31).nullable(),
  active: z.boolean().default(true),
  startedOn: IsoDate.nullable(),
});
export type IncomeSource = z.infer<typeof IncomeSource>;


