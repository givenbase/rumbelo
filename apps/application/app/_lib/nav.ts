/**
 * Navigation model — mirrors design `GROUPS` (Kluis Finance App.dc.html:2942).
 *
 * Routes and identifiers: English (HANDOFF §6).
 * Labels shown in the UI: Dutch (design default locale).
 * screenKey: used by plan-gating (lib/plan.ts → SCREEN_MIN).
 */
export const NAV_GROUPS = [
  {
    key: 'home',
    label: 'Overzicht',
    icon: '◇',
    href: '/',
    children: [
      { href: '/',       label: 'Overzicht', screenKey: 'dashboard' },
      { href: '/ritual', label: 'Coach',     screenKey: 'ritual'    },
      { href: '/why',    label: 'Waarom',    screenKey: 'why'       },
    ],
  },
  {
    key: 'money',
    label: 'Mijn geld',
    icon: '◈',
    href: '/money/overview',
    children: [
      { href: '/money/overview',    label: 'Overzicht', screenKey: 'overview' },
      { href: '/money/jars',        label: 'Potten',    screenKey: 'jars'     },
      { href: '/money/transactions',label: 'Uitgaven',  screenKey: 'tx'       },
      { href: '/money/debts',       label: 'Schulden',  screenKey: 'debt'     },
      { href: '/money/fixed-costs', label: 'Vast',      screenKey: 'fixed'    },
    ],
  },
  {
    key: 'growth',
    label: 'Mijn groei',
    icon: '↗',
    href: '/growth',
    children: [
      { href: '/growth',         label: 'Overzicht', screenKey: 'growth-hub' },
      { href: '/growth/goals',   label: 'Doelen',    screenKey: 'goals'      },
      { href: '/growth/income',  label: 'Inkomen',   screenKey: 'income'     },
      { href: '/growth/learn',   label: 'Leren',     screenKey: 'learn'      },
      { href: '/growth/board',   label: 'Vermogen',  screenKey: 'board'      },
    ],
  },
  {
    key: 'energy',
    label: 'Mijn energie',
    // U+2733 + VS15 (text) — bare ✳ becomes the green ❇️ emoji on Apple fonts
    icon: '✳\uFE0E',
    href: '/energy',
    children: [
      { href: '/energy',        label: 'Overzicht', screenKey: 'energy-hub' },
      { href: '/energy/week',   label: 'Week',      screenKey: 'week'       },
      { href: '/energy/sleep',  label: 'Slaap',     screenKey: 'sleep'      },
      { href: '/energy/train',  label: 'Trainen',   screenKey: 'train'      },
      { href: '/energy/food',   label: 'Voeding',   screenKey: 'food'       },
    ],
  },
  {
    key: 'soul',
    label: 'Mijn ziel',
    icon: '✦',
    href: '/soul',
    children: [
      { href: '/soul',           label: 'Overzicht', screenKey: 'soul-hub' },
      { href: '/soul/mind',      label: 'Stilte',    screenKey: 'mind'     },
      { href: '/soul/gratitude', label: 'Dank',      screenKey: 'grat'     },
      { href: '/soul/intent',    label: 'Intentie',  screenKey: 'intent'   },
      { href: '/soul/chakra',    label: 'Centra',    screenKey: 'chakra'   },
    ],
  },
] as const;

/** Compact labels for the desktop portal pill bar (design SHORT map, NL). */
export const TOP_PILL_LABELS: Record<string, string> = {
  home:   'Overzicht',
  money:  'Geld',
  growth: 'Groei',
  energy: 'Energie',
  soul:   'Ziel',
};

export type NavGroup = (typeof NAV_GROUPS)[number];
export type NavChild = NavGroup['children'][number];

/** Bottom tabs — design `SHORT` map NL column (home → Start). */
export const BOTTOM_TABS = [
  { href: '/',              label: 'Start',   glyph: '◇' },
  { href: '/money/overview',label: 'Geld',    glyph: '◈' },
  { href: '/growth',        label: 'Groei',   glyph: '↗' },
  { href: '/energy',        label: 'Energie', glyph: '✳\uFE0E' },
  { href: '/soul',          label: 'Ziel',    glyph: '✦' },
] as const;
