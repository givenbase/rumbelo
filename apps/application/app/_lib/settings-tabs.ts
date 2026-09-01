/** Settings section keys — Account at `/settings`; others at `/settings/[section]`. */
export type SettingsTab =
    'account' | 'jars' | 'bank' | 'groei' | 'energie' | 'ziel' | 'systeem' | 'plan' | 'export';

export const DEFAULT_TAB: SettingsTab = 'account';

export const SETTINGS_TABS: { key: SettingsTab; label: string; sub: string }[] = [
    { key: 'account', label: 'Account', sub: 'Profile & security' },
    { key: 'jars', label: 'Jars', sub: 'Split & names' },
    { key: 'bank', label: 'Bank', sub: 'Import & connection' },
    { key: 'groei', label: 'Growth', sub: 'Income & goals' },
    { key: 'energie', label: 'Energy', sub: 'Sleep & training' },
    { key: 'ziel', label: 'Soul', sub: 'Intent & centres' },
    { key: 'systeem', label: 'System', sub: 'Display & period' },
    { key: 'plan', label: 'Plan', sub: 'Subscription' },
    { key: 'export', label: 'Export', sub: 'Take your data with you' },
];

const TAB_KEYS = new Set<string>(SETTINGS_TABS.map(t => t.key));

export function isSettingsTab(value: string | undefined | null): value is SettingsTab {
    return Boolean(value && TAB_KEYS.has(value));
}

/** Active section from `/settings` (account) or `/settings/jars`, etc. */
export function settingsTabFromPathname(pathname: string): SettingsTab {
    const segments = pathname.split('/').filter(Boolean);
    // ['settings'] → account | ['settings', 'jars'] → jars
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
            return 'systeem';
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
