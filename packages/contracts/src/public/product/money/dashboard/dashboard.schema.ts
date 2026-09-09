/**
 * Dashboard Schemas (Money)
 * One aggregated read for the money dashboard — avoids a waterfall of round trips.
 * Zod only — no `export type`.
 */

import { z } from 'zod';

import { IsoDate, Money, PeriodKey } from '../../../../common/common.schema';
import { CoachMessage } from '../../../platform/coach/coach.schema';
import { JarBalance } from '../jar/jar.schema';
import { MonthScore } from '../month-score/month-score.schema';

/** One aggregated read for the dashboard — avoids a waterfall of round trips. */
export const Dashboard = z.object({
    period: PeriodKey,
    periodLabel: z.string(),
    allocatedTotal: Money,
    incomeTotal: Money,
    spentTotal: Money,
    avgLeftOver: Money,
    /** What is safe to spend today without breaking any jar's line. */
    safePerDay: Money,
    playLeft: Money,
    inboxCount: z.int(),
    /** Jars that are not overspent this period. */
    jarsOnTrack: z.int(),
    jarsTotal: z.int(),
    /** Monthly-normalised active fixed OUT across all jars. */
    fixedCostsMonthly: Money,
    /** Estimated debt-free month (YYYY-MM-DD), null when no debts or no payment pool. */
    debtFreeOn: IsoDate.nullable(),
    debtMonthsRemaining: z.int().nullable(),
    jars: z.array(JarBalance),
    coach: z.array(CoachMessage),
    monthScore: MonthScore,
    why: z.string().nullable(),
});

// Inferred types (same-module merge for consumers)
export type Dashboard = z.infer<typeof Dashboard>;
