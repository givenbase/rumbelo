import { z } from 'zod';
import { IsoDate, Money, PeriodKey } from '../../../../common/schemas';
import { JarBalance } from './jar';
import { CoachMessage } from '../../../platform/schemas/coach';
import { MonthScore } from './month-score';

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
export type Dashboard = z.infer<typeof Dashboard>;
