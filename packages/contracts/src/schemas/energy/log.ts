import { z } from 'zod';
import { Id, UserId, HouseholdId, IsoDate } from '../common.js';

/**
 * "Energie draagt geld." Sleep, training and food are tracked because the product
 * claims they are the floor under financial decisions — not as lifestyle extras.
 * Correlation with spending is surfaced, never asserted as causation.
 */
export const EnergyMetric = z.enum(['SLEEP', 'TRAIN', 'FOOD', 'MIND']);

export const EnergyLog = z.object({
    id: Id,
    householdId: HouseholdId,
    userId: UserId,
    on: IsoDate,
    metric: EnergyMetric,
    /** Normalised 0..100 so metrics are comparable on one axis. */
    value: z.number().min(0).max(100),
    note: z.string().max(280).nullable(),
});
export type EnergyLog = z.infer<typeof EnergyLog>;

export const EnergySummary = z.object({
    metric: EnergyMetric,
    average7d: z.number(),
    average28d: z.number(),
    trend: z.enum(['UP', 'FLAT', 'DOWN']),
    /** Pearson r against daily discretionary spend. Informational only. */
    spendCorrelation: z.number().min(-1).max(1).nullable(),
});
