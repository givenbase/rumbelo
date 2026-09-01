/** Map Next routes to design screen keys for why-lines and plan gating. */
const EXACT: Record<string, string> = {
    '/': 'dashboard',
    '/ritual': 'ritual',
    '/why': 'why',
    '/money/overview': 'geldhome',
    '/money/jars': 'jars',
    '/money/transactions': 'tx',
    '/money/debts': 'debt',
    '/money/fixed-costs': 'fixed',
    '/growth': 'groeihome',
    '/growth/goals': 'goals',
    '/growth/income': 'income',
    '/growth/learn': 'learn',
    '/growth/board': 'board',
    '/energy': 'energiehome',
    '/energy/week': 'week',
    '/energy/sleep': 'sleep',
    '/energy/train': 'train',
    '/energy/food': 'food',
    '/soul': 'zielhome',
    '/soul/mind': 'mind',
    '/soul/gratitude': 'grat',
    '/soul/intent': 'intent',
    '/soul/chakra': 'chakra',
    '/settings': 'settings',
};

export function screenKeyForPath(pathname: string): string | null {
    if (EXACT[pathname]) return EXACT[pathname];
    if (pathname.startsWith('/settings')) return 'settings';
    return null;
}
