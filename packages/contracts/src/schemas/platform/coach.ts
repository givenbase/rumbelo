import { z } from 'zod';
import { Id, PeriodKey, HouseholdId } from '../common';

/**
 * The Coach never scolds — the manifesto is "informatie, nooit schaamte".
 * Every message must carry exactly one concrete next move.
 */
export const CoachKind = z.enum(['NUDGE', 'WIN', 'WARNING', 'INSIGHT', 'RITUAL']);

export const CoachMessage = z.object({
    id: Id,
    householdId: HouseholdId,
    period: PeriodKey,
    kind: CoachKind,
    text: z.string().max(500),
    /** The single action this message asks for; null when purely informational. */
    ctaLabel: z.string().max(60).nullable(),
    ctaHref: z.string().max(200).nullable(),
    dismissedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
});
export type CoachMessage = z.infer<typeof CoachMessage>;
