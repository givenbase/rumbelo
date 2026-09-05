import { formatMoney } from '@rumbelo/utils';

/**
 * Portal overview configs — shapes and copy from the design's HUBS block.
 * Card values are placeholders until live hub APIs exist.
 */
import type { PortalHubProps } from '@/components/features/home/portal-hub';

export const moneyPortalHub: PortalHubProps = {
    tint: 'var(--color-jar-give)',
    icon: '◈',
    eyebrow: 'Money · this month',
    title: 'How your money moves.',
    line: 'Four places, one question each. Pick up where you left off.',
    coach: {
        dot: 'var(--color-accent)',
        kind: 'START HERE',
        text: 'Add income and fixed costs first — then your jars show what is left to steer.',
        cta: 'Open jars',
        href: '/product/money/jars',
    },
    cards: [
        {
            name: 'Jars',
            value: '0 / 0',
            note: 'jars on track this month',
            color: 'var(--color-jar-nec)',
            chart: { kind: 'ring', pct: 0 },
            href: '/product/money/jars',
        },
        {
            name: 'Spending',
            value: formatMoney(0),
            note: 'booked this month',
            color: 'var(--color-jar-play)',
            chart: { kind: 'bars', bars: [0, 0, 0, 0, 0, 0, 0] },
            href: '/product/money/transactions',
        },
        {
            name: 'Debt',
            value: '—',
            note: 'the month you are free',
            color: 'var(--color-danger)',
            chart: { kind: 'bars', bars: [0, 0, 0, 0, 0, 0, 0] },
            href: '/product/money/debts',
        },
        {
            name: 'Fixed',
            value: formatMoney(0),
            note: 'fixed costs per month',
            color: 'var(--color-jar-nec)',
            chart: { kind: 'ring', pct: 0 },
            href: '/product/money/fixed-costs',
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
        href: '/product/growth/income',
    },
    cards: [
        {
            name: 'Goals',
            value: '0',
            note: 'goals in progress',
            color: 'var(--color-jar-lts)',
            chart: { kind: 'ring', pct: 0 },
            href: '/product/growth/goals',
        },
        {
            name: 'Income',
            value: formatMoney(0),
            note: 'per month now',
            color: 'var(--color-accent)',
            chart: { kind: 'bars', bars: [0, 0, 0, 0, 0, 0, 0] },
            href: '/product/growth/income',
        },
        {
            name: 'Learn',
            value: '0',
            note: 'books in your queue',
            color: 'var(--color-jar-edu)',
            chart: { kind: 'ring', pct: 0 },
            href: '/product/growth/learn',
        },
        {
            name: 'Net worth',
            value: formatMoney(0),
            note: 'truly yours',
            color: 'var(--color-jar-ff)',
            chart: { kind: 'bars', bars: [0, 0, 0, 0, 0, 0, 0] },
            href: '/product/growth/board',
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
        dot: 'var(--color-accent)',
        kind: 'COMING SOON',
        text: 'Energy tracking is on the way — sleep, training, and nutrition in one place.',
        cta: 'Open your week',
        href: '/product/energy/week',
    },
    cards: [
        {
            name: 'Week',
            value: '—',
            note: 'hours you steer',
            color: 'var(--color-accent)',
            chart: { kind: 'ring', pct: 0 },
            href: '/product/energy/week',
        },
        {
            name: 'Sleep',
            value: '—',
            note: 'per night',
            color: 'var(--color-jar-lts)',
            chart: { kind: 'bars', bars: [0, 0, 0, 0, 0, 0, 0] },
            href: '/product/energy/sleep',
        },
        {
            name: 'Training',
            value: '0 / 0',
            note: 'sessions this week',
            color: 'var(--color-jar-ff)',
            chart: { kind: 'ring', pct: 0 },
            href: '/product/energy/train',
        },
        {
            name: 'Food',
            value: '—',
            note: 'protein today',
            color: 'var(--color-jar-play)',
            chart: { kind: 'ring', pct: 0 },
            href: '/product/energy/food',
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
        dot: 'var(--color-accent)',
        kind: 'START SMALL',
        text: 'One minute of stillness or one line of gratitude — both protect the jars.',
        cta: 'Open stillness',
        href: '/product/soul/mind',
    },
    cards: [
        {
            name: 'Stillness',
            value: '—',
            note: 'days in a row',
            color: 'var(--color-portal-soul)',
            chart: { kind: 'bars', bars: [0, 0, 0, 0, 0, 0, 0] },
            href: '/product/soul/mind',
        },
        {
            name: 'Thanks',
            value: '0',
            note: 'things noted',
            color: 'var(--color-jar-give)',
            chart: { kind: 'ring', pct: 0 },
            href: '/product/soul/gratitude',
        },
        {
            name: 'Intent',
            value: '—',
            note: 'for this week',
            color: 'var(--color-accent)',
            chart: { kind: 'ring', pct: 0 },
            href: '/product/soul/intent',
        },
        {
            name: 'Centres',
            value: '0',
            note: 'centres named today',
            color: 'var(--color-jar-edu)',
            chart: { kind: 'ring', pct: 0 },
            href: '/product/soul/chakra',
        },
    ],
};
