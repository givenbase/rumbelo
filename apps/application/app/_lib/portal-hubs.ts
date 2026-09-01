import { formatMoney } from '@rumbelo/utils';

/**
 * Portal overview configs — shapes and copy from the design's HUBS block
 * (Kluis Finance App.dc.html:3478-3527), values derived from mock fixtures.
 */
import type { PortalHubProps } from '@/components/features/home/portal-hub';

import { INCOME_SOURCES, mockDebts, mockFixedCosts, mockGoals, mockJars } from '@/app/_mock';

const NET = INCOME_SOURCES.reduce((s, i) => s + i.amount, 0);
const SPENT_TOTAL = mockJars.reduce((s, j) => s + j.spent, 0);
const JARS_ON = mockJars.filter(j => !j.overspent).length;
const FIXED_PM = mockFixedCosts.reduce((s, f) => s + Math.abs(f.amount), 0);
const DEBT_BAL = mockDebts.reduce((s, d) => s + d.balance, 0);
const INCOME_PM = NET;
const GOALS_ON = mockGoals.length;
const GOALS_RING = Math.round(
    (mockGoals.reduce((t, g) => t + Math.min(1, g.saved / g.target), 0) / mockGoals.length) * 100
);

function spark(vals: number[]): number[] {
    const max = Math.max(...vals, 1);
    const min = Math.min(...vals, 0);
    const span = Math.max(1, max - min);
    return vals.map(v => Math.max(6, Math.round(((v - min) / span) * 100)));
}

export const moneyPortalHub: PortalHubProps = {
    tint: 'var(--color-jar-give)',
    icon: '◈',
    eyebrow: 'Money · this month',
    title: 'How your money moves.',
    line: 'Four places, one question each. Pick up where you left off.',
    coach: {
        dot: 'var(--color-warning)',
        kind: 'ONE MOVE',
        text: 'Necessity ran past its line. Shift what is loose in Necessity and the month is clean again.',
        cta: 'Open jars',
        href: '/money/jars',
    },
    cards: [
        {
            name: 'Jars',
            value: `${JARS_ON} / ${mockJars.length}`,
            note: 'jars on track this month',
            color: 'var(--color-jar-nec)',
            chart: { kind: 'ring', pct: Math.round((JARS_ON / mockJars.length) * 100) },
            href: '/money/jars',
        },
        {
            name: 'Spending',
            value: formatMoney(SPENT_TOTAL),
            note: 'booked this month',
            color: 'var(--color-jar-play)',
            chart: { kind: 'bars', bars: spark([620, 810, 540, 930, 700, 880, SPENT_TOTAL / 100]) },
            delta: { mark: '↓', text: '8% vs last month', positive: true },
            href: '/money/transactions',
        },
        {
            name: 'Debt',
            value: '03-2029',
            note: 'the month you are free',
            color: 'var(--color-danger)',
            chart: {
                kind: 'bars',
                bars: spark([9200, 8100, 7400, 6300, 5200, 4100, DEBT_BAL / 100]),
            },
            delta: { mark: '↓', text: '4% vs last month', positive: true },
            href: '/money/debts',
        },
        {
            name: 'Fixed',
            value: formatMoney(FIXED_PM),
            note: 'fixed costs per month',
            color: 'var(--color-jar-nec)',
            chart: {
                kind: 'ring',
                pct: Math.round(((FIXED_PM + DEBT_BAL / 12) / INCOME_PM) * 100),
            },
            delta: { mark: '↓', text: '2% vs last month', positive: true },
            href: '/money/fixed-costs',
        },
    ],
};

export const growthPortalHub: PortalHubProps = {
    tint: 'var(--color-jar-lts)',
    icon: '↗',
    eyebrow: 'Growth · long term',
    title: 'Where your money stands.',
    line: 'What you aim for, what you earn, what you learn, what you own.',
    coach: {
        dot: 'var(--color-accent)',
        kind: 'THE LEVER',
        text: 'Cutting costs has a floor; raising income does not. Income is the faster lever.',
        cta: 'Open income',
        href: '/growth/income',
    },
    cards: [
        {
            name: 'Goals',
            value: String(GOALS_ON),
            note: 'goals in progress',
            color: 'var(--color-jar-lts)',
            chart: { kind: 'ring', pct: GOALS_RING },
            href: '/growth/goals',
        },
        {
            name: 'Income',
            value: formatMoney(INCOME_PM),
            note: 'per month now',
            color: 'var(--color-accent)',
            chart: {
                kind: 'bars',
                bars: spark([2900, 3150, 3400, 3650, 3900, 4100, INCOME_PM / 100]),
            },
            delta: { mark: '↑', text: '2% vs last month', positive: true },
            href: '/growth/income',
        },
        {
            name: 'Learn',
            value: '1',
            note: 'book you are in now',
            color: 'var(--color-jar-edu)',
            chart: { kind: 'ring', pct: 25 },
            href: '/growth/learn',
        },
        {
            name: 'Net worth',
            value: formatMoney(52_000_00),
            note: 'truly yours',
            color: 'var(--color-jar-ff)',
            chart: { kind: 'bars', bars: spark([31000, 36000, 41000, 47000, 52000, 57000, 52000]) },
            delta: { mark: '↓', text: '9% vs last month', positive: false },
            href: '/growth/board',
        },
    ],
};

export const energyPortalHub: PortalHubProps = {
    tint: 'var(--color-jar-play)',
    icon: '✳\uFE0E',
    eyebrow: 'Energy · your capacity',
    title: 'The floor under every decision.',
    line: 'Hours, sleep, training, food. What makes the money decisions possible.',
    coach: {
        dot: 'var(--color-success)',
        kind: 'SOLID FLOOR',
        text: '8 hours a night and 3 of 4 sessions done. This is the floor your money decisions stand on — it holds.',
        cta: 'Open your week',
        href: '/energy/week',
    },
    cards: [
        {
            name: 'Week',
            value: '40h',
            note: 'hours you steer',
            color: 'var(--color-accent)',
            chart: { kind: 'ring', pct: Math.round((40 / 168) * 100) },
            href: '/energy/week',
        },
        {
            name: 'Sleep',
            value: '8h',
            note: 'per night',
            color: 'var(--color-jar-lts)',
            chart: { kind: 'bars', bars: spark([7, 6.5, 8, 7.5, 6, 8.5, 8].map(h => h * 10)) },
            delta: { mark: '↑', text: '11% vs last month', positive: true },
            href: '/energy/sleep',
        },
        {
            name: 'Training',
            value: '3 / 4',
            note: 'sessions this week',
            color: 'var(--color-jar-ff)',
            chart: { kind: 'ring', pct: 75 },
            delta: { mark: '↑', text: '33% vs last month', positive: true },
            href: '/energy/train',
        },
        {
            name: 'Food',
            value: '96g',
            note: 'protein today',
            color: 'var(--color-jar-play)',
            chart: { kind: 'ring', pct: 68 },
            href: '/energy/food',
        },
    ],
};

export const soulPortalHub: PortalHubProps = {
    tint: 'var(--color-portal-soul)',
    icon: '✦',
    eyebrow: 'Soul · the why',
    title: 'The why under the numbers.',
    line: 'Without this, steering is just bookkeeping.',
    coach: {
        dot: 'var(--color-success)',
        kind: 'KEEP GOING',
        text: '4 days of stillness in a row. This is the cheapest jar there is: it costs no money and protects all the others.',
        cta: 'Open stillness',
        href: '/soul/mind',
    },
    cards: [
        {
            name: 'Stillness',
            value: '4d',
            note: 'days in a row',
            color: 'var(--color-portal-soul)',
            chart: { kind: 'bars', bars: spark([10, 10, 6, 10, 10, 10, 12]) },
            delta: { mark: '↑', text: '100% vs last month', positive: true },
            href: '/soul/mind',
        },
        {
            name: 'Thanks',
            value: '3',
            note: 'things noted',
            color: 'var(--color-jar-give)',
            chart: { kind: 'ring', pct: 100 },
            delta: { mark: '↓', text: '40% vs last month', positive: false },
            href: '/soul/gratitude',
        },
        {
            name: 'Intent',
            value: 'set',
            note: 'for this week',
            color: 'var(--color-accent)',
            chart: { kind: 'ring', pct: 100 },
            href: '/soul/intent',
        },
        {
            name: 'Centres',
            value: '1',
            note: 'centre named today',
            color: 'var(--color-jar-edu)',
            chart: { kind: 'ring', pct: 14 },
            href: '/soul/chakra',
        },
    ],
};
