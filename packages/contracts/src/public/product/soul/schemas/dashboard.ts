import { z } from 'zod';

import { CoachMessage } from '../../../platform/schemas/coach';

/**
 * Soul portal hub composition. Stillness streak uses energy MIND logs when present;
 * centres stay 0 until a centres entity exists; intention is money week-check text
 * when that practice set one (closest persisted “intent” today).
 */
export const SoulDashboard = z.object({
    /** Consecutive days with a MIND log ending today (UTC), null when never logged. */
    stillnessStreakDays: z.int().nullable(),
    gratitudeThisWeek: z.int(),
    /** Money week-check intention for the current week, if any. */
    intention: z.string().max(280).nullable(),
    /** No centres entity yet. */
    centresNamedToday: z.int(),
    coach: z.array(CoachMessage),
});
export type SoulDashboard = z.infer<typeof SoulDashboard>;
