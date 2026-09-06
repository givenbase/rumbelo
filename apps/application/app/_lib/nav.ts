/**
 * Navigation model — mirrors design `GROUPS` (Kluis Finance App.dc.html:2942).
 *
 * Product routes live under `/product/…` (visible slug).
 * Platform settings stay at `/settings/…`. Auth stays unprefixed.
 *
 * `capabilityKey`: plan gating key (`{product}-{feature}` when gated;
 * free hub routes use a local key that is not in CAPABILITIES).
 */
import { CAPABILITIES } from './plan';
import { productPath } from './routes';

export const NAV_GROUPS = [
    {
        key: 'home',
        label: 'Overview',
        icon: '◇',
        href: '/',
        children: [
            { href: '/', label: 'Overview', capabilityKey: 'home-overview' },
            { href: productPath('ritual'), label: 'Coach', capabilityKey: 'home-ritual' },
            { href: productPath('why'), label: 'Why', capabilityKey: 'home-why' },
        ],
    },
    {
        key: 'money',
        label: 'My money',
        icon: '◈',
        href: productPath('money/overview'),
        children: [
            {
                href: productPath('money/overview'),
                label: 'Overview',
                capabilityKey: 'money-overview',
            },
            { href: productPath('money/jars'), label: 'Jars', capabilityKey: 'money-jars' },
            {
                href: productPath('money/transactions'),
                label: 'Spending',
                capabilityKey: 'money-transactions',
            },
            {
                href: productPath('money/debts'),
                label: 'Debt',
                capabilityKey: CAPABILITIES.moneyDebt,
            },
            {
                href: productPath('money/fixed-costs'),
                label: 'Fixed',
                capabilityKey: 'money-fixed',
            },
        ],
    },
    {
        key: 'growth',
        label: 'My growth',
        icon: '↗',
        href: productPath('growth'),
        children: [
            { href: productPath('growth'), label: 'Overview', capabilityKey: 'growth-overview' },
            {
                href: productPath('growth/goals'),
                label: 'Goals',
                capabilityKey: CAPABILITIES.growthGoals,
            },
            {
                href: productPath('growth/income'),
                label: 'Income',
                capabilityKey: CAPABILITIES.growthIncome,
            },
            {
                href: productPath('growth/learn'),
                label: 'Learn',
                capabilityKey: CAPABILITIES.growthLearn,
            },
            {
                href: productPath('growth/board'),
                label: 'Net worth',
                capabilityKey: CAPABILITIES.growthBoard,
            },
        ],
    },
    {
        key: 'energy',
        label: 'My energy',
        // U+2733 + VS15 (text) — bare ✳ becomes the green ❇️ emoji on Apple fonts
        icon: '✳\uFE0E',
        href: productPath('energy'),
        children: [
            { href: productPath('energy'), label: 'Overview', capabilityKey: 'energy-overview' },
            {
                href: productPath('energy/week'),
                label: 'Week',
                capabilityKey: CAPABILITIES.energyWeek,
            },
            { href: productPath('energy/sleep'), label: 'Sleep', capabilityKey: 'energy-sleep' },
            { href: productPath('energy/train'), label: 'Training', capabilityKey: 'energy-train' },
            { href: productPath('energy/food'), label: 'Food', capabilityKey: 'energy-food' },
        ],
    },
    {
        key: 'soul',
        label: 'My soul',
        icon: '✦',
        href: productPath('soul'),
        children: [
            { href: productPath('soul'), label: 'Overview', capabilityKey: 'soul-overview' },
            { href: productPath('soul/mind'), label: 'Stillness', capabilityKey: 'soul-mind' },
            {
                href: productPath('soul/gratitude'),
                label: 'Thanks',
                capabilityKey: 'soul-gratitude',
            },
            { href: productPath('soul/intent'), label: 'Intent', capabilityKey: 'soul-intent' },
            {
                href: productPath('soul/chakra'),
                label: 'Centres',
                capabilityKey: CAPABILITIES.soulChakra,
            },
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

/** True when `pathname` is exactly `href` or a nested route under it. */
export function pathMatchesNavHref(pathname: string, href: string): boolean {
    const path = normalizeAppPathname(pathname);
    if (href === '/') return path === '/';
    return path === href || path.startsWith(`${href}/`);
}

/**
 * Strip locale prefix / trailing slash so gating matches nav hrefs.
 * Defensive: next/navigation can occasionally disagree with next-intl.
 */
export function normalizeAppPathname(pathname: string): string {
    let path = pathname.split(/[?#]/)[0] || '/';
    path = path.replace(/^\/(en|nl)(?=\/|$)/, '') || '/';
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    return path || '/';
}

/**
 * Longest-prefix nav child for the current path.
 * Critical for plan gating: `/product/growth/income` → `growth-income`,
 * not the shorter Overview hub (`growth-overview`).
 */
export function resolveNavChildForPath(pathname: string): NavChild | null {
    const path = normalizeAppPathname(pathname);
    const matches: NavChild[] = [];
    for (const group of NAV_GROUPS) {
        for (const child of group.children) {
            if (pathMatchesNavHref(path, child.href)) matches.push(child);
        }
    }
    if (matches.length === 0) return null;
    return matches.reduce((best, child) => (child.href.length > best.href.length ? child : best));
}

export function resolveNavGroupForPath(pathname: string): NavGroup | null {
    const child = resolveNavChildForPath(pathname);
    if (child) {
        return (
            NAV_GROUPS.find(group =>
                group.children.some(navChild => navChild.href === child.href)
            ) ?? null
        );
    }
    return (
        NAV_GROUPS.find(group =>
            group.children.some(navChild => pathMatchesNavHref(pathname, navChild.href))
        ) ?? null
    );
}
