import { z } from 'zod';

import { Cadence, IncomeKind } from '../../../../enums';
import { HouseholdId, Id, IsoDate, Money } from '../../../../common/schemas';

export { IncomeKind } from '../../../../enums';

export const IncomeSource = z.object({
    id: Id,
    householdId: HouseholdId,
    name: z.string().min(1).max(120),
    kind: z.enum(IncomeKind),
    amount: Money,
    cadence: z.enum(Cadence),
    /** Day of month the money lands; drives the auto-split trigger. */
    expectedDay: z.int().min(1).max(31).nullable(),
    isActive: z.boolean().default(true),
    startedOn: IsoDate.nullable(),
});
export type IncomeSource = z.infer<typeof IncomeSource>;
