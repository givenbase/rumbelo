/**
 * Navigation model — mirrors design `GROUPS` (Kluis Finance App.dc.html:2942).
 *
 * Product routes live under `/product/…` (visible slug).
 * Platform settings stay at `/settings/…`. Auth stays unprefixed.
 *
 * Labels shown in the UI: English by default; Dutch via locale toggle / i18n.
 * screenKey: used by plan-gating (lib/plan.ts → SCREEN_MIN).
 */
import { productPath } from './routes';

export const NAV_GROUPS = [
    {
        key: 'home',
        label: 'Overview',
        icon: '◇',
        href: '/',
        children: [
            { href: '/', label: 'Overview', screenKey: 'dashboard' },
            { href: productPath('ritual'), label: 'Coach', screenKey: 'ritual' },
            { href: productPath('why'), label: 'Why', screenKey: 'why' },
        ],
    },
    {
        key: 'money',
        label: 'My money',
        icon: '◈',
        href: productPath('money/overview'),
        children: [
            { href: productPath('money/overview'), label: 'Overview', screenKey: 'overview' },
            { href: productPath('money/jars'), label: 'Jars', screenKey: 'jars' },
            { href: productPath('money/transactions'), label: 'Spending', screenKey: 'tx' },
            { href: productPath('money/debts'), label: 'Debt', screenKey: 'debt' },
            { href: productPath('money/fixed-costs'), label: 'Fixed', screenKey: 'fixed' },
        ],
    },
    {
        key: 'growth',
        label: 'My growth',
        icon: '↗',
        href: productPath('growth'),
        children: [
            { href: productPath('growth'), label: 'Overview', screenKey: 'growth-hub' },
            { href: productPath('growth/goals'), label: 'Goals', screenKey: 'goals' },
            { href: productPath('growth/income'), label: 'Income', screenKey: 'income' },
            { href: productPath('growth/learn'), label: 'Learn', screenKey: 'learn' },
            { href: productPath('growth/board'), label: 'Net worth', screenKey: 'board' },
        ],
    },
    {
        key: 'energy',
        label: 'My energy',
        // U+2733 + VS15 (text) — bare ✳ becomes the green ❇️ emoji on Apple fonts
        icon: '✳\uFE0E',
        href: productPath('energy'),
        children: [
            { href: productPath('energy'), label: 'Overview', screenKey: 'energy-hub' },
            { href: productPath('energy/week'), label: 'Week', screenKey: 'week' },
            { href: productPath('energy/sleep'), label: 'Sleep', screenKey: 'sleep' },
            { href: productPath('energy/train'), label: 'Training', screenKey: 'train' },
            { href: productPath('energy/food'), label: 'Food', screenKey: 'food' },
        ],
    },
    {
        key: 'soul',
        label: 'My soul',
        icon: '✦',
        href: productPath('soul'),
        children: [
            { href: productPath('soul'), label: 'Overview', screenKey: 'soul-hub' },
            { href: productPath('soul/mind'), label: 'Stillness', screenKey: 'mind' },
            { href: productPath('soul/gratitude'), label: 'Thanks', screenKey: 'grat' },
            { href: productPath('soul/intent'), label: 'Intent', screenKey: 'intent' },
            { href: productPath('soul/chakra'), label: 'Centres', screenKey: 'chakra' },
        ],
    },
] as const;

/** Compact labels for the desktop portal pill bar (design SHORT map, EN). */
export const TOP_PILL_LABELS: Record<string, string> = {
    home: 'Overview',
    money: 'Money',
    growth: 'Growth',
    energy: 'Energy',
    soul: 'Soul',
};

export type NavGroup = (typeof NAV_GROUPS)[number];
export type NavChild = NavGroup['children'][number];

/** Bottom tabs — design `SHORT` map EN column (home → Start). */
export const BOTTOM_TABS = [
    { href: '/', label: 'Start', glyph: '◇' },
    { href: productPath('money/overview'), label: 'Money', glyph: '◈' },
    { href: productPath('growth'), label: 'Growth', glyph: '↗' },
    { href: productPath('energy'), label: 'Energy', glyph: '✳\uFE0E' },
    { href: productPath('soul'), label: 'Soul', glyph: '✦' },
] as const;
