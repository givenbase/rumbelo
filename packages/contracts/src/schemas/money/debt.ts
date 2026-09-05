import { z } from 'zod';

import { DebtKind, PayoffStrategy } from '../../enums';
import { HouseholdId, Id, IsoDate, Money } from '../common';

export { DebtKind, PayoffStrategy } from '../../enums';

export const Debt = z.object({
    id: Id,
    householdId: HouseholdId,
    name: z.string().min(1).max(120),
    kind: z.enum(DebtKind),
    balance: Money,
    originalBalance: Money,
    /** Annual percentage rate, e.g. 12.9 */
    interestRate: z.number().min(0).max(100),
    minimumPayment: Money,
    extraPayment: Money,
    dueDay: z.int().min(1).max(31).nullable(),
    closedOn: IsoDate.nullable(),
});
export type Debt = z.infer<typeof Debt>;

export const DebtPlan = z.object({
    strategy: z.enum(PayoffStrategy),
    totalBalance: Money,
    totalInterestProjected: Money,
    debtFreeOn: IsoDate.nullable(),
    monthsRemaining: z.int().nullable(),
    order: z.array(z.object({ debtId: Id, name: z.string(), payoffOn: IsoDate.nullable() })),
});
