/** Home / turn / coach fixtures for the dashboard preview. */

import { currentPeriod } from '@rumbelo/utils';

import { NET_INCOME, mockJars } from './jars';

export const mockDashboard = {
  period: currentPeriod(),
  allocatedTotal: NET_INCOME,
  incomeTotal: NET_INCOME,
  spentTotal: mockJars.reduce((s, j) => s + j.spent, 0),
  avgLeftOver: 41_500,
  safePerDay: 2_800,
  playLeft: mockJars.find((j) => j.key === 'PLAY')!.remaining,
  inboxCount: 6,
  why: 'A calm head, and a place of my own in five years.',
};

export const mockTurn = {
  period: currentPeriod(),
  score: 72,
  maxScore: 100,
  daysLeft: 6,
  level: 3,
  levelLabel: 'Navigator',
  events: [
    { day: 24, text: 'Salary split across six jars', points: 12, kind: 'INCOME_LOGGED' },
    { day: 22, text: 'Inbox cleared', points: 8, kind: 'INBOX_CLEARED' },
    { day: 18, text: 'Weekly ritual completed', points: 10, kind: 'RITUAL_DONE' },
    { day: 14, text: 'Play went over the line', points: -5, kind: 'JAR_OVERSPENT' },
    { day: 7, text: 'Emergency fund topped up', points: 10, kind: 'GOAL_REACHED' },
  ],
} as const;

export const mockCoach = [
  { id: 'c1', kind: 'NUDGE', text: 'Six transactions are waiting for a jar. Ten minutes and your overview is right again.', ctaLabel: 'Sort inbox', ctaHref: '/money/transactions' },
  { id: 'c2', kind: 'WIN', text: 'Necessity is 8% under the line this month. That is €340 you can redirect.', ctaLabel: 'Redirect', ctaHref: '/ritual' },
] as const;
