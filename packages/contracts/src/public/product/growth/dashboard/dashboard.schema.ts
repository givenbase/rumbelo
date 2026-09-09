/**
 * Dashboard Schemas (Growth)
 * Growth portal hub composition.
 * Zod only — no `export type`.
 */

import { z } from 'zod';

import { Money } from '../../../../common/common.schema';
import { CoachMessage } from '../../../platform/coach/coach.schema';

/**
 * Growth portal hub composition — goals/income from money aggregates;
 * learn queue and net-worth assets stay null/0 until those entities exist.
 */
export const GrowthDashboard = z.object({
    goalsActive: z.int(),
    goalsTotal: z.int(),
    /** Mean progress 0–100 across active goals (0 when none). */
    goalsProgressPct: z.int().min(0).max(100),
    incomeMonthly: Money,
    /** No learn-queue entity yet — always 0 until books are persisted. */
    learnQueued: z.int(),
    /** No holdings entity yet — null means show an honest em dash. */
    netWorth: Money.nullable(),
    coach: z.array(CoachMessage),
});

// Inferred types (same-module merge for consumers)
export type GrowthDashboard = z.infer<typeof GrowthDashboard>;
