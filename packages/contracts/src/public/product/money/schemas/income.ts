import { z } from 'zod';

import { Cadence, IncomeKind } from '../../../../enums';
import { HouseholdId, Id, IsoDate, Money } from '../../../../common/schemas';

export { IncomeKind } from '../../../../enums';

/** Dated amount for an income source — history of raises / cuts. */
export const IncomeAmountPeriod = z.object({
    id: Id,
    amount: Money,
    effectiveOn: IsoDate,
});
export type IncomeAmountPeriod = z.infer<typeof IncomeAmountPeriod>;

export const IncomeSource = z.object({
    id: Id,
    householdId: HouseholdId,
    name: z.string().min(1).max(120),
    kind: z.enum(IncomeKind),
    /** Cached current amount (latest period) — used by jar monthly net. */
    amount: Money,
    cadence: z.enum(Cadence),
    /** Day of month the money lands; drives the auto-split trigger. */
    expectedDay: z.int().min(1).max(31).nullable(),
    isActive: z.boolean().default(true),
    startedOn: IsoDate.nullable(),
    /** Newest first. */
    periods: z.array(IncomeAmountPeriod).default([]),
});
export type IncomeSource = z.infer<typeof IncomeSource>;
