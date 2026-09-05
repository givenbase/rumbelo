/**
 * Static copy for jar cards — English default (Kluis Finance App.dc.html JAR_DEFS / JAR_USE).
 * Keys match contract jar keys (NECESSITIES, …).
 */

export type JarGuideKey =
    | 'NECESSITIES'
    | 'FINANCIAL_FREEDOM'
    | 'LONG_TERM_SAVINGS'
    | 'EDUCATION'
    | 'PLAY'
    | 'GIVE';

export interface JarGuide {
    note: string;
    allowed: string[];
    notAllowed: string;
    links: { href: string; label: string }[];
    subs?: { label: string; pct: number }[];
    subNote?: string;
}

export const JAR_GUIDE: Record<JarGuideKey, JarGuide> = {
    NECESSITIES: {
        note: 'Rent, energy, insurance, groceries, transport. Staying under 55% is the whole game.',
        allowed: [
            'Rent',
            'Energy & water',
            'Groceries',
            'Transport & fuel',
            'Insurance',
            'Debt instalments',
            'Phone & internet',
        ],
        notAllowed: 'Not for eating out, clothes or fun — that is Play.',
        links: [
            { href: '/money/fixed-costs', label: 'Fixed costs ›' },
            { href: '/money/debts', label: 'Debt ›' },
            { href: '/money/transactions', label: 'Spending ›' },
        ],
    },
    FINANCIAL_FREEDOM: {
        note: 'This jar buys assets. Money goes in and never comes out — only returns do.',
        allowed: [
            'Index funds & ETFs',
            'Long-term stocks',
            'Bonds',
            'Property deposit',
            'Your own business',
        ],
        notAllowed:
            'Never withdraw to buy something. Only the return may leave — and better to leave that in too.',
        links: [
            { href: '/growth/board', label: 'My net worth ›' },
            { href: '/growth/goals', label: 'My goals ›' },
        ],
        subs: [
            { label: 'Index funds', pct: 70 },
            { label: 'Crypto', pct: 20 },
            { label: 'Trading & experiments', pct: 10 },
        ],
        subNote:
            'Trading is allowed, but only from this 10% corner — never from the rest. Lose it and you lose a month, not your future.',
    },
    EDUCATION: {
        note: 'Books, courses, mentors, tools. The only spend that raises your earning power.',
        allowed: [
            'Books',
            'Courses & training',
            'Mentor or coach',
            'Tools & software',
            'Conferences',
        ],
        notAllowed:
            'Only if it raises your earning power. A course you never finish belongs in Play.',
        links: [
            { href: '/money/transactions', label: 'Spending ›' },
            { href: '/growth/goals', label: 'My goals ›' },
        ],
    },
    LONG_TERM_SAVINGS: {
        note: 'Emergency fund, car, down payment. Known, planned, not urgent.',
        allowed: [
            'Emergency fund',
            'Car or big purchase',
            'Down payment',
            'Renovation',
            'Tax bill',
        ],
        notAllowed:
            'Known, planned, not urgent. Urgent and unexpected? That is exactly what the emergency fund is for.',
        links: [
            { href: '/growth/goals', label: 'My goals ›' },
            { href: '/money/transactions', label: 'Spending ›' },
        ],
    },
    PLAY: {
        note: 'Spend it every month. A plan with no joy in it does not survive.',
        allowed: [
            'Eating & drinking out',
            'Outings & concerts',
            'Clothes',
            'Spontaneous buys',
            'Gifts to yourself',
        ],
        notAllowed: 'No brakes, no guilt — but no top-up from another jar when it is empty either.',
        links: [{ href: '/money/transactions', label: 'Spending ›' }],
    },
    GIVE: {
        note: 'Giving keeps money a tool and not a master. Transferred automatically.',
        allowed: [
            'Your foundation',
            'Charities',
            'Church or community',
            'Helping someone who needs it',
        ],
        notAllowed: 'No favours expected, no tax-deduction thinking. Giving keeps money a tool.',
        links: [{ href: '/money/transactions', label: 'Spending ›' }],
    },
};
