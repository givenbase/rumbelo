import { z } from 'zod';
import { Id, Money, WeekKey, HouseholdId } from '../common.js';

/**
 * The ten-minute weekly ritual: look, redirect, set intention.
 * Deliberately three steps — the product's core claim is that this beats daily worry.
 */
export const RitualStage = z.enum(['LOOK', 'REDIRECT', 'INTEND', 'DONE']);

export const SurplusAllocation = z.object({
    jarId: Id,
    amount: Money,
});

export const WeeklyRitual = z.object({
    id: Id,
    householdId: HouseholdId,
    week: WeekKey,
    stage: RitualStage,
    surplus: Money,
    allocations: z.array(SurplusAllocation),
    /** The single sentence the user commits to for the coming week. */
    intention: z.string().max(280).nullable(),
    completedAt: z.iso.datetime().nullable(),
});
export type WeeklyRitual = z.infer<typeof WeeklyRitual>;
