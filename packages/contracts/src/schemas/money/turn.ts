import { z } from 'zod';

import { TurnEventKind } from '../../enums';
import { HouseholdId, Id, Money, PeriodKey } from '../common';

export { TurnEventKind } from '../../enums';

/**
 * The Monopoly layer. One period (month) is one "turn"; it accrues a score from
 * observable behaviour, closes on rollover, and is never re-openable — the log is
 * the user's honest history, not a leaderboard to be gamed.
 */
export const TurnEvent = z.object({
    id: Id,
    householdId: HouseholdId,
    period: PeriodKey,
    kind: z.enum(TurnEventKind),
    day: z.int().min(1).max(31),
    text: z.string().max(240),
    points: z.int(),
});
export type TurnEvent = z.infer<typeof TurnEvent>;

export const Turn = z.object({
    householdId: HouseholdId,
    period: PeriodKey,
    score: z.int(),
    maxScore: z.int(),
    daysLeft: z.int(),
    closed: z.boolean(),
    level: z.int().min(1),
    levelLabel: z.string(),
    events: z.array(TurnEvent),
});
export type Turn = z.infer<typeof Turn>;

export const Level = z.object({
    index: z.int().min(1),
    label: z.string(),
    /** Cumulative score needed to enter this level. */
    threshold: z.int(),
    unlocks: z.array(z.string()),
});

/** End-of-period recap shown before the next turn begins. */
export const PeriodRecap = z.object({
    period: PeriodKey,
    income: Money,
    allocated: Money,
    spent: Money,
    leftOver: Money,
    score: z.int(),
    bestJar: z.string().nullable(),
    worstJar: z.string().nullable(),
    headline: z.string(),
});
