/** Map Next routes to design screen keys for why-lines and plan gating. */
const EXACT: Record<string, string> = {
    '/': 'dashboard',
    '/product/ritual': 'ritual',
    '/product/why': 'why',
    '/product/money/overview': 'geldhome',
    '/product/money/jars': 'jars',
    '/product/money/transactions': 'tx',
    '/product/money/debts': 'debt',
    '/product/money/fixed-costs': 'fixed',
    '/product/growth': 'groeihome',
    '/product/growth/goals': 'goals',
    '/product/growth/income': 'income',
    '/product/growth/learn': 'learn',
    '/product/growth/board': 'board',
    '/product/energy': 'energiehome',
    '/product/energy/week': 'week',
    '/product/energy/sleep': 'sleep',
    '/product/energy/train': 'train',
    '/product/energy/food': 'food',
    '/product/soul': 'zielhome',
    '/product/soul/mind': 'mind',
    '/product/soul/gratitude': 'grat',
    '/product/soul/intent': 'intent',
    '/product/soul/chakra': 'chakra',
    '/settings': 'settings',
};

export function screenKeyForPath(pathname: string): string | null {
    if (EXACT[pathname]) return EXACT[pathname];
    if (pathname.startsWith('/settings')) return 'settings';
    return null;
}
