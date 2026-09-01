/**
 * Design / preview fixtures — not product code.
 *
 * Shapes match the oRPC contract so screens can swap
 * `mockX` → `useQuery(api.…)` in one line.
 *
 * Jar names/subtitles are verbatim from Kluis Finance App.dc.html
 * (:2239-2256); English jar labels stay even in Dutch UI copy.
 */
export {
  INCOME_SOURCES,
  JAR_META,
  mockJars,
} from './jars';

export {
  mockDebts,
  mockFixedCosts,
  mockTransactions,
} from './money';

export {
  type HoldingKind,
  mockGoals,
  mockHoldings,
} from './growth';

export {
  mockCoach,
  mockDashboard,
  mockTurn,
} from './home';

export {
  SESSION_COLORS,
  SLEEP_HOURS,
  mockEnergy,
  mockFood,
  mockSessions,
  mockSleepStages,
} from './energy';

export {
  mockGratitude,
  mockMind,
} from './soul';
