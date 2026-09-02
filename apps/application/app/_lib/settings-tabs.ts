/**
 * Settings IA — product-scoped, not a flat preference dump.
 *
 * 1. Platform (General / Data): account, plan, export — cross-product.
 * 2. Per product (Money / Growth / Energy / Soul): same groups as NAV_GROUPS.
 * 3. Only product *children* that need prefs get an entry (hubs / overview skip).
 *
 * Money children → settings:
 *   jars → split %, jar→account, coach
 *   debt → avalanche / snowball
 *   bank (account infra) → manual accounts + PSD2
 *   systeem (rules infra) → automation toggles
 *
 * Growth → groei (goals horizon). Energy → energie (week/body). Soul → ziel (stillness).
 */
export type SettingsTab =
    | 'account'
    | 'jars'
    | 'debt'
    | 'bank'
    | 'groei'
    | 'energie'
    | 'ziel'
    | 'systeem'
    | 'plan'
    | 'export';

export const DEFAULT_TAB: SettingsTab = 'account';

export type SettingsNavItem = {
    key: SettingsTab;
    label: string;
    sub: string;
    /** Product child / screen this settings page configures, when applicable. */
    productChild?: string;
};

export type SettingsNavSection = {
    title: string;
    /** `platform` or a NAV_GROUPS key. */
    product: 'platform' | 'money' | 'growth' | 'energy' | 'soul' | 'data';
    items: SettingsNavItem[];
};

/** Grouped nav — platform first, then products, then data. */
export const SETTINGS_SECTIONS: SettingsNavSection[] = [
    {
        title: 'General',
        product: 'platform',
        items: [
            { key: 'account', label: 'Account', sub: 'Profile, sign-in, language' },
            { key: 'plan', label: 'Plan', sub: 'What you use and pay' },
        ],
    },
    {
        title: 'Money',
        product: 'money',
        items: [
            { key: 'jars', label: 'Jars', sub: 'Split, accounts, coach', productChild: 'jars' },
            { key: 'debt', label: 'Debt', sub: 'Payoff method', productChild: 'debt' },
            { key: 'bank', label: 'Bank', sub: 'Accounts and PSD2', productChild: 'account' },
            {
                key: 'systeem',
                label: 'Automation',
                sub: 'Rules without asking',
                productChild: 'rule',
            },
        ],
    },
    {
        title: 'Growth',
        product: 'growth',
        items: [
            { key: 'groei', label: 'Goals', sub: 'Planning horizon', productChild: 'goals' },
        ],
    },
    {
        title: 'Energy',
        product: 'energy',
        items: [
            {
                key: 'energie',
                label: 'Week',
                sub: 'Hours, sleep and weight',
                productChild: 'week',
            },
        ],
    },
    {
        title: 'Soul',
        product: 'soul',
        items: [
            {
                key: 'ziel',
                label: 'Stillness',
                sub: 'Minutes a day and reminders',
                productChild: 'mind',
            },
        ],
    },
    {
        title: 'Data',
        product: 'data',
        items: [{ key: 'export', label: 'Export', sub: 'Excel or CSV' }],
    },
];

/** Flat list for lookups — order follows sections. */
export const SETTINGS_TABS: SettingsNavItem[] = SETTINGS_SECTIONS.flatMap(s => s.items);

const TAB_KEYS = new Set<string>(SETTINGS_TABS.map(t => t.key));

export function isSettingsTab(value: string | undefined | null): value is SettingsTab {
    return Boolean(value && TAB_KEYS.has(value));
}

/** Active section from `/settings` (account) or `/settings/jars`, etc. */
export function settingsTabFromPathname(pathname: string): SettingsTab {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] !== 'settings') return DEFAULT_TAB;
    const section = segments[1];
    return isSettingsTab(section) ? section : DEFAULT_TAB;
}

/** Map portal nav group → default settings section for that product. */
export function settingsTabForNavGroup(groupKey: string | null | undefined): SettingsTab {
    switch (groupKey) {
        case 'money':
            return 'jars';
        case 'growth':
            return 'groei';
        case 'energy':
            return 'energie';
        case 'soul':
            return 'ziel';
        case 'home':
            return 'account';
        default:
            return DEFAULT_TAB;
    }
}

/** Account lives at `/settings`; every other section at `/settings/[section]`. */
export function settingsHref(tab: SettingsTab = DEFAULT_TAB): string {
    return tab === 'account' ? '/settings' : `/settings/${tab}`;
}

export function settingsHrefForNavGroup(groupKey: string | null | undefined): string {
    return settingsHref(settingsTabForNavGroup(groupKey));
}
