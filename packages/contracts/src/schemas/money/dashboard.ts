import { z } from 'zod';
import { Money, PeriodKey } from '../common.js';
import { JarBalance } from './jar.js';
import { CoachMessage } from '../platform/coach.js';
import { Turn } from './turn.js';

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
  jars: z.array(JarBalance),
  coach: z.array(CoachMessage),
  turn: Turn,
  why: z.string().nullable(),
});
export type Dashboard = z.infer<typeof Dashboard>;
