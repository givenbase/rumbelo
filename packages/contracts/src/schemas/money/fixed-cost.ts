import { z } from 'zod';
import { Cadence, Id, IsoDate, Money, HouseholdId } from '../common.js';

/** Recurring obligations. They draw from a jar, so they are visible before they hit. */
export const FixedCost = z.object({
    id: Id,
    householdId: HouseholdId,
    jarId: Id,
    categoryId: Id.nullable(),
    name: z.string().min(1).max(120),
    amount: Money,
    cadence: Cadence,
    dueDay: z.int().min(1).max(31).nullable(),
    /** Direction: money out (a bill) or money in (a recurring credit). */
    direction: z.enum(['OUT', 'IN']),
    active: z.boolean().default(true),
    endsOn: IsoDate.nullable(),
    note: z.string().max(500).nullable(),
});
export type FixedCost = z.infer<typeof FixedCost>;

export const FixedCostsByJar = z.object({
    jarId: Id,
    jarKey: z.string(),
    jarName: z.string(),
    total: Money,
    items: z.array(FixedCost),
});
