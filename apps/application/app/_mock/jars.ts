/** Jar catalogue + period allocations for design preview. */

export const JAR_META = [
    {
        key: 'NECESSITIES',
        name: 'Necessity',
        subtitle: 'Must-pays',
        icon: '🏠',
        pct: 55,
        color: 'bg-jar-nec',
        text: 'text-jar-nec',
    },
    {
        key: 'FINANCIAL_FREEDOM',
        name: 'Financial Freedom',
        subtitle: 'Never spend',
        icon: '🔒',
        pct: 10,
        color: 'bg-jar-ff',
        text: 'text-jar-ff',
    },
    {
        key: 'LONG_TERM_SAVINGS',
        name: 'Long Term Savings',
        subtitle: 'Big things',
        icon: '🎯',
        pct: 10,
        color: 'bg-jar-lts',
        text: 'text-jar-lts',
    },
    {
        key: 'EDUCATION',
        name: 'Education',
        subtitle: 'Grow yourself',
        icon: '📚',
        pct: 10,
        color: 'bg-jar-edu',
        text: 'text-jar-edu',
    },
    {
        key: 'PLAY',
        name: 'Play',
        subtitle: 'Guilt-free',
        icon: '✨',
        pct: 10,
        color: 'bg-jar-play',
        text: 'text-jar-play',
    },
    {
        key: 'GIVE',
        name: 'Give / foundation',
        subtitle: 'Pass it on',
        icon: '🤲',
        pct: 5,
        color: 'bg-jar-give',
        text: 'text-jar-give',
    },
] as const;

/** Salary €3,450 + Freelance €850 — design dashboard figures. */
export const INCOME_SOURCES = [
    { label: 'Salary', amount: 345_000 },
    { label: 'Freelance', amount: 85_000 },
] as const;

const NET_INCOME = INCOME_SOURCES.reduce((s, i) => s + i.amount, 0);

/** Per-jar category budgets, minor units. */
const JAR_CATEGORIES: Record<string, { name: string; budgeted: number; actual: number }[]> = {
    NECESSITIES: [
        { name: 'Rent', budgeted: 145_000, actual: 145_000 },
        { name: 'Groceries', budgeted: 55_500, actual: 59_000 },
        { name: 'Utilities & insurance', budgeted: 36_000, actual: 34_000 },
    ],
    FINANCIAL_FREEDOM: [
        { name: 'Index funds', budgeted: 31_000, actual: 0 },
        { name: 'Individual stocks', budgeted: 12_000, actual: 0 },
    ],
    LONG_TERM_SAVINGS: [
        { name: 'Emergency fund', budgeted: 30_000, actual: 12_000 },
        { name: 'Car fund', budgeted: 13_000, actual: 0 },
    ],
    EDUCATION: [
        { name: 'Books', budgeted: 12_000, actual: 8_500 },
        { name: 'Courses', budgeted: 31_000, actual: 10_000 },
    ],
    PLAY: [
        { name: 'Eating out', budgeted: 22_000, actual: 20_000 },
        { name: 'Hobbies', budgeted: 21_000, actual: 14_000 },
    ],
    GIVE: [
        { name: 'Monthly donation', budgeted: 15_000, actual: 9_000 },
        { name: 'Gifts', budgeted: 6_500, actual: 0 },
    ],
};

export const mockJars = JAR_META.map((j, i) => {
    const allocated = Math.round((NET_INCOME * j.pct) / 100);
    // Necessity stays slightly overspent on purpose — exercises the danger meter.
    const spent = [238_000, 0, 12_000, 18_500, 34_000, 9_000][i] ?? 0;
    const id = `jar-${i}`;
    return {
        id,
        key: j.key,
        name: j.name,
        subtitle: j.subtitle,
        icon: j.icon,
        percentage: j.pct,
        color: j.color,
        text: j.text,
        spendable: j.key !== 'FINANCIAL_FREEDOM',
        allocated,
        spent,
        remaining: allocated - spent,
        overspent: allocated - spent < 0,
        progress: allocated > 0 ? Math.min(1, Math.max(0, (allocated - spent) / allocated)) : null,
        categories: (JAR_CATEGORIES[j.key] ?? []).map((c, ci) => ({
            id: `${id}-cat-${ci}`,
            jarId: id,
            name: c.name,
            budgeted: c.budgeted,
            actual: c.actual,
            archived: false,
        })),
    };
});

export { NET_INCOME };
