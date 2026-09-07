import { z } from 'zod';

import { CoachMessage } from '../../../platform/schemas/coach';

/**
 * Energy portal hub composition. Scores are the normalised 0–100 log scale
 * (not hours/grams) — UI notes must match that semantics.
 */
export const EnergyDashboard = z.object({
    weekCheckCompleted: z.boolean(),
    /** 7-day average SLEEP score, null when no logs. */
    sleepScore7d: z.number().min(0).max(100).nullable(),
    /** TRAIN log count in the current ISO week. */
    trainSessionsThisWeek: z.int(),
    /** 7-day average FOOD score, null when no logs. */
    foodScore7d: z.number().min(0).max(100).nullable(),
    coach: z.array(CoachMessage),
});
export type EnergyDashboard = z.infer<typeof EnergyDashboard>;
