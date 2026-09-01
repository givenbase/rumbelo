export type IconName =
  | 'home' | 'trend' | 'book' | 'lock' | 'sparkle'
  | 'heart' | 'down' | 'divide' | 'wallet' | 'shield' | 'eye' | 'db';

export const ICON_PATHS: Record<IconName, string[]> = {
  home: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
  trend: ['M22 7l-8.5 8.5-5-5L2 17', 'M16 7h6v6'],
  book: ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'],
  lock: ['M7 11V7a5 5 0 0 1 10 0v4', 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z'],
  sparkle: ['M12 3l-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z'],
  heart: ['M19 14c1.5-1.4 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.1 3 5.5l7 7z'],
  down: ['M12 8v8', 'M8 12l4 4 4-4', 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'],
  divide: ['M5 12h14', 'M12 5.5h.01', 'M12 18.5h.01'],
  wallet: ['M21 12V7H5a2 2 0 0 1 0-4h14v4', 'M3 5v14a2 2 0 0 0 2 2h16v-5', 'M18 12a2 2 0 0 0 0 4h4v-4z'],
  shield: ['M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z'],
  eye: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  db: ['M12 8c5 0 9-1.3 9-3s-4-3-9-3-9 1.3-9 3 4 3 9 3z', 'M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5', 'M3 12c0 1.7 4 3 9 3s9-1.3 9-3'],
};

export interface Jar {
  key: string;
  name: string;
  pct: number;
  colorVar: string;
  line: string;
  not: string;
  icon: IconName;
}

export const JARS: Jar[] = [
  {
    key: 'nec', name: 'Necessity', pct: 55, colorVar: 'var(--color-jar-nec)',
    line: 'Rent, energy, insurance, groceries, transport. The things that arrive whether you like it or not.',
    not: 'Not for eating out or clothes — that is Play.', icon: 'home',
  },
  {
    key: 'ff', name: 'Financial Freedom', pct: 10, colorVar: 'var(--color-jar-ff)',
    line: 'Index funds, stocks, a property deposit, your own company. This jar buys things that pay you back.',
    not: 'Never spent. Only invested.', icon: 'trend',
  },
  {
    key: 'edu', name: 'Education', pct: 10, colorVar: '#0891B2',
    line: 'Books, courses, tools, a mentor. The only jar where spending makes you worth more.',
    not: 'Not for gadgets you call research.', icon: 'book',
  },
  {
    key: 'lts', name: 'Long Term Savings', pct: 10, colorVar: '#0369A1',
    line: 'Emergency fund first, then the car, the deposit, the tax bill you know is coming.',
    not: 'Not for anything you want this month.', icon: 'lock',
  },
  {
    key: 'play', name: 'Play', pct: 10, colorVar: '#B45309',
    line: 'Dinner out, concerts, clothes, something spontaneous. Spend it without asking permission.',
    not: 'Must be empty by month end. That is the point.', icon: 'sparkle',
  },
  {
    key: 'give', name: 'Give', pct: 5, colorVar: '#15803D',
    line: 'Your foundation, a charity, helping someone who needs it. Generosity as a habit, not a mood.',
    not: 'Not a tip you already left.', icon: 'heart',
  },
];

export interface Pillar {
  name: string;
  metric: string;
  icon: IconName;
  color: string;
  line: string;
}

export const PILLARS: Pillar[] = [
  {
    name: 'Money', metric: 'THIS MONTH', icon: 'trend', color: '#15803D',
    line: 'How your money moves: six jars filled the second income lands, plus spending, fixed costs and debt. A hard ceiling on must-pays and one jar you never spend.',
  },
  {
    name: 'Growth', metric: 'OVER THE YEARS', icon: 'book', color: '#0369A1',
    line: 'Where your money sits: your goals, your income curve, what you learn, and your net worth. Cash flow is this month; this is the decade.',
  },
  {
    name: 'Energy', metric: 'YOUR CAPACITY', icon: 'sparkle', color: '#B45309',
    line: 'Your week, your sleep, your training, your food. Not vanity metrics — the floor under every financial decision you make.',
  },
  {
    name: 'Soul', metric: 'THE WHY', icon: 'lock', color: '#6366F1',
    line: 'Stillness, gratitude, one intention a week, and a vocabulary for where energy gets stuck. Control without a why is just bookkeeping.',
  },
];

export const PROOF = [
  { n: '4', l: 'portals, one switch' },
  { n: '55%', l: 'cap on must-pays' },
  { n: '€0', l: 'to start' },
];

export interface JourneyStep {
  n: string;
  title: string;
  tag: string;
  you: string;
  rumbelo: string;
  math: string;
  why: string;
}

export const JOURNEY: JourneyStep[] = [
  {
    n: '01', title: 'Tell Rumbelo what lands', tag: 'THE SIX-JAR SPLIT',
    you: 'Type one number: what arrives in your account each month. Salary, freelance, anything.',
    rumbelo: 'Builds your six jars around it, with a hard ceiling on living costs — every euro gets a job before it arrives.',
    math: '€4,300 → 55% must-pays · 10% invest · 10% save · 10% learn · 10% play · 5% give',
    why: 'The oldest budgeting idea there is. The rule that matters: the split happens on arrival, not at month end. If must-pays need more than 55%, that is the problem to fix — not your discipline.',
  },
  {
    n: '02', title: 'Income arrives — the split just happens', tag: 'PAY YOURSELF FIRST',
    you: 'Nothing. That is the point.',
    rumbelo: 'Moves 10% into Financial Freedom before you can touch it — the jar that is never spent, only invested in things that pay you back.',
    math: '€430/month at 7% ≈ €74,000 in 10 years · €220,000 in 20',
    why: 'Compound growth is the whole trick. The jar exists so you never have to decide to invest — it already happened.',
  },
  {
    n: '03', title: 'You spend from jars, not a balance', tag: 'SAFE TO SPEND',
    you: 'Live your life. Buy the coffee, book the dinner — from the jar that is for it.',
    rumbelo: 'Shows one number every morning: what is genuinely free, after everything already promised to rent and bills.',
    math: '(€583 + €224 left) ÷ 8 days = €64 safe to spend today',
    why: 'A bank balance lies — it shows money that is already spoken for. Stay under the number and every jar survives the month by construction.',
  },
  {
    n: '04', title: 'Your debts get a plan', tag: 'AVALANCHE & SNOWBALL',
    you: 'Enter each debt once: what, how much, what interest.',
    rumbelo: 'Sorts good debt from expensive debt, computes both payoff orders, and shows the month you are free.',
    math: 'DUO 2.56% → pay minimum · credit card 14% → kill first · free: Feb 2035',
    why: 'Debt under roughly 4–5% is cheaper than inflation — pay the minimum and invest the difference. Expensive debt gets killed first, always.',
  },
  {
    n: '05', title: 'You watch freedom grow', tag: 'THE FREEDOM NUMBER',
    you: 'Keep going. Check in once a week.',
    rumbelo: 'Tracks what you own, what it pays you monthly, and how much of your living costs it already covers — your level, from Survival to Free.',
    math: 'Assets pay €168/month · covers 14% of your costs → Level 2 of 5',
    why: 'The end state this whole system points at: when what you own pays your monthly costs, a salary becomes optional.',
  },
];

export interface Plan {
  key: string;
  name: string;
  m: number;
  y: number;
  tag: string;
  line: string;
  feats: string[];
}

export const PLANS: Plan[] = [
  {
    key: 'grip', name: 'Grip', m: 0, y: 0, tag: 'Free forever',
    line: 'The six jars and the practice underneath. No bank needed, no card needed — enough to start, and never a reason to stop.',
    feats: [
      'MONEY · the six jars with your own percentages',
      'Add expenses yourself · fixed costs',
      'Safe to spend per day',
      'SOUL · stillness and one intention a week',
      'The coach — ten minutes a week',
    ],
  },
  {
    key: 'ritme', name: 'Engine', m: 9, y: 90, tag: 'Most chosen',
    line: 'The part that runs without you — plus Energy. Banks tied to jars, transactions sorted on arrival, your week and your body in view.',
    feats: [
      'Connect ING, Revolut, bunq and more',
      'Transactions arrive, Rumbelo guesses the jar',
      'Debt plan with interest and an end date',
      'ENERGY · your week, sleep, training, food',
      'SOUL · gratitude and the seven centres',
      'Unlimited history and export',
    ],
  },
  {
    key: 'groei', name: 'Compound', m: 19, y: 190, tag: 'All four portals',
    line: 'Where the money starts making money. Your goals, your income curve, what you learn and your net worth — plus your devices later.',
    feats: [
      'GROWTH · goals with a date and a jar',
      'My income — curve, target and the four levers',
      'What I learn — books and what they changed',
      'Net worth, returns and your freedom number',
      'Connect devices — watch, scale, ring (coming)',
    ],
  },
];

export const ASSURANCES: { t: string; icon: IconName }[] = [
  { t: 'Free plan needs no card and never expires.', icon: 'shield' },
  { t: 'Bank data is read-only, via PSD2, and only after you connect it yourself.', icon: 'eye' },
  { t: 'Cancel a paid plan and everything you entered stays readable.', icon: 'db' },
];

export const TRUST_CARDS: { icon: IconName; head: string; line: string }[] = [
  { icon: 'lock', head: 'Payments by Stripe', line: 'Card details go to Stripe, never to Rumbelo. PCI-DSS Level 1 — the same standard your bank uses.' },
  { icon: 'eye', head: 'Read-only bank access', line: 'Connected through PSD2-licensed providers. Rumbelo can look, never move money.' },
  { icon: 'shield', head: 'GDPR & EU hosting', line: 'Your data lives on EU servers, encrypted at rest. Export or delete it any time.' },
  { icon: 'db', head: 'Yours, always', line: 'Cancel and every jar, transaction and goal stays readable. No lock-in, no hostage data.' },
];

export const TRUST_BADGES = [
  'STRIPE VERIFIED PARTNER', 'PSD2 · READ-ONLY', 'GDPR COMPLIANT', '256-BIT TLS',
];

export const FOOT_COLS = [
  {
    head: 'Product',
    links: [
      { t: 'The jars', href: '#jars' },
      { t: 'How it works', href: '#how' },
      { t: 'Pricing', href: '#pricing' },
      { t: 'Bank connections', href: '#how' },
    ],
  },
  {
    head: 'Legal',
    links: [
      { t: 'Privacy policy', href: '#' },
      { t: 'Terms of service', href: '#' },
      { t: 'Data processing', href: '#' },
      { t: 'Cookie policy', href: '#' },
    ],
  },
  {
    head: 'Contact',
    links: [
      { t: 'support@rumbelo.app', href: 'mailto:support@rumbelo.app' },
      { t: 'Press & partnerships', href: '#' },
      { t: 'Status', href: '#' },
    ],
  },
];

export const FLOATERS = [
  ['+€3,450', 6, 4, 14, 0, 0.14], ['−55%', 15, 46, 11, 3.5, 0.10], ['+€850', 26, 22, 12, 7, 0.12],
  ['NEC → €2,365', 36, 60, 10, 1.8, 0.09], ['FF → €430', 47, 12, 11, 5.2, 0.11],
  ['−€38.65', 56, 40, 12, 9.4, 0.10], ['PLAY → €430', 66, 68, 10, 2.6, 0.08],
  ['+7% p.a.', 76, 30, 13, 6.1, 0.12], ['GIVE → €215', 85, 55, 10, 8.3, 0.09],
  ['55 / 10 / 10 / 10 / 10 / 5', 62, 8, 11, 4.4, 0.11], ['€64 / day', 92, 18, 12, 1.1, 0.12],
  ['LTS → €430', 10, 72, 10, 10.6, 0.08],
].map(([text, left, top, size, delay, o], i) => ({
  text: text as string,
  left: `${left}%`,
  top: `${top}%`,
  size: `${size}px`,
  dur: `${14 + (i % 5) * 3}s`,
  delay: `${delay}s`,
  o: o as number,
  color: i % 3 === 0 ? 'var(--color-accent)' : 'var(--color-fg-muted)',
}));

const TICKER_RAW = [
  ['Salary landed · split in 0.4s', 'var(--color-success)'],
  ['Groceries −€38.65 → Necessity', 'var(--color-fg-muted)'],
  ['€430 → world index fund', 'var(--color-accent)'],
  ['Coffee −€5.20 → Play', 'var(--color-fg-muted)'],
  ['Debt-free: Feb 2035 · on track', 'var(--color-success)'],
  ['Freelance +€850 · split in 0.3s', 'var(--color-success)'],
  ['Safe to spend today: €64', 'var(--color-accent)'],
  ['Gym −€32 → Play · flagged', 'var(--color-warning)'],
];
export const TICKER = [...TICKER_RAW, ...TICKER_RAW].map(([t, dot]) => ({
  t: t as string,
  dot: dot as string,
}));

export const COACH_GLANCE_POINTS = [
  'One verdict, one action — never a wall of charts',
  'Ten minutes a week with the coach, not daily homework',
  'Every jar over its line comes with the one move that fixes it',
];

export const DEMO_INCOME_DEFAULT = 4300;

export const BRAND = 'Rumbelo';

export const FOOTER_COLUMNS = FOOT_COLS;

const JAR_ICONS: Record<string, string> = {
  nec: '🏠',
  ff: '📈',
  edu: '📚',
  lts: '🔒',
  play: '✨',
  give: '💚',
};

export const JAR_CARDS = JARS.map((j) => ({
  name: j.name,
  pct: `${j.pct}%`,
  line: j.line,
  not: j.not,
  icon: JAR_ICONS[j.key] ?? '◈',
}));
