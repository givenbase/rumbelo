/**
 * Navigation model — mirrors design `GROUPS` (Kluis Finance App.dc.html:2942).
 *
 * Routes and identifiers: English (HANDOFF §6).
 * Labels shown in the UI: English by default; Dutch via locale toggle / i18n.
 * screenKey: used by plan-gating (lib/plan.ts → SCREEN_MIN).
 */
export const NAV_GROUPS = [
  {
    key: 'home',
    label: 'Overview',
    icon: '◇',
    href: '/',
    children: [
      { href: '/',       label: 'Overview', screenKey: 'dashboard' },
      { href: '/ritual', label: 'Coach',    screenKey: 'ritual'    },
      { href: '/why',    label: 'Why',      screenKey: 'why'       },
    ],
  },
  {
    key: 'money',
    label: 'My money',
    icon: '◈',
    href: '/money/overview',
    children: [
      { href: '/money/overview',     label: 'Overview',   screenKey: 'overview' },
      { href: '/money/jars',         label: 'Jars',       screenKey: 'jars'     },
      { href: '/money/transactions', label: 'Spending',   screenKey: 'tx'       },
      { href: '/money/debts',        label: 'Debt',       screenKey: 'debt'     },
      { href: '/money/fixed-costs',  label: 'Fixed',      screenKey: 'fixed'    },
    ],
  },
  {
    key: 'growth',
    label: 'My growth',
    icon: '↗',
    href: '/growth',
    children: [
      { href: '/growth',        label: 'Overview', screenKey: 'growth-hub' },
      { href: '/growth/goals',  label: 'Goals',    screenKey: 'goals'      },
      { href: '/growth/income', label: 'Income',   screenKey: 'income'     },
      { href: '/growth/learn',  label: 'Learn',    screenKey: 'learn'      },
      { href: '/growth/board',  label: 'Net worth', screenKey: 'board'      },
    ],
  },
  {
    key: 'energy',
    label: 'My energy',
    // U+2733 + VS15 (text) — bare ✳ becomes the green ❇️ emoji on Apple fonts
    icon: '✳\uFE0E',
    href: '/energy',
    children: [
      { href: '/energy',       label: 'Overview', screenKey: 'energy-hub' },
      { href: '/energy/week',  label: 'Week',     screenKey: 'week'       },
      { href: '/energy/sleep', label: 'Sleep',    screenKey: 'sleep'      },
      { href: '/energy/train', label: 'Training', screenKey: 'train'      },
      { href: '/energy/food',  label: 'Food',     screenKey: 'food'       },
    ],
  },
  {
    key: 'soul',
    label: 'My soul',
    icon: '✦',
    href: '/soul',
    children: [
      { href: '/soul',           label: 'Overview',  screenKey: 'soul-hub' },
      { href: '/soul/mind',      label: 'Stillness', screenKey: 'mind'     },
      { href: '/soul/gratitude', label: 'Thanks',    screenKey: 'grat'     },
      { href: '/soul/intent',    label: 'Intent',    screenKey: 'intent'   },
      { href: '/soul/chakra',    label: 'Centres',   screenKey: 'chakra'   },
    ],
  },
] as const;

/** Compact labels for the desktop portal pill bar (design SHORT map, EN). */
export const TOP_PILL_LABELS: Record<string, string> = {
  home:   'Overview',
  money:  'Money',
  growth: 'Growth',
  energy: 'Energy',
  soul:   'Soul',
};

export type NavGroup = (typeof NAV_GROUPS)[number];
export type NavChild = NavGroup['children'][number];

/** Bottom tabs — design `SHORT` map EN column (home → Start). */
export const BOTTOM_TABS = [
  { href: '/',               label: 'Start',  glyph: '◇' },
  { href: '/money/overview', label: 'Money',  glyph: '◈' },
  { href: '/growth',         label: 'Growth', glyph: '↗' },
  { href: '/energy',         label: 'Energy', glyph: '✳\uFE0E' },
  { href: '/soul',           label: 'Soul',   glyph: '✦' },
] as const;
