/**
 * Canonical map: design screen key → Next route → build status.
 *
 * Dual UI authorities (Claude Design exports — no invented layouts):
 * - Authenticated product: `design/Kluis Finance App.dc.html`
 * - Marketing site: `design/Kluis Landing.dc.html` → see `apps/website/lib/design-landing-sections.ts`
 */

export type DesignScreenStatus = 'shell' | 'domain' | 'partial' | 'missing' | 'redirect';

export interface DesignScreen {
  key: string;
  section: string;
  route: string;
  navGroup: 'home' | 'money' | 'growth' | 'energy' | 'soul' | 'settings' | 'overlay';
  status: DesignScreenStatus;
  gap: string;
}

export const DESIGN_SCREENS: DesignScreen[] = [
  { key: 'dashboard', section: 'DASHBOARD', route: '/', navGroup: 'home', status: 'partial', gap: 'Live dashboard query when household active; layout 1240px + coach Delen (Phase 7 partial)' },
  { key: 'ritual', section: 'WEEKTELLING', route: '/ritual', navGroup: 'home', status: 'partial', gap: 'RitualWizard + ritual.advance persistence when live' },
  { key: 'why', section: 'WAAROM KLUIS', route: '/why', navGroup: 'home', status: 'shell', gap: 'Foundation layout — 4 principles + quote' },

  { key: 'geldhome', section: 'PORTAL OVERZICHT', route: '/money/overview', navGroup: 'money', status: 'shell', gap: 'PortalHub money config' },
  { key: 'jars', section: 'POTTEN / JARS', route: '/money/jars', navGroup: 'money', status: 'partial', gap: 'Card grid + split simulator from design; ListToolbar Move money + URL modal; live balances when not in preview' },
  { key: 'tx', section: 'TRANSACTIES', route: '/money/transactions', navGroup: 'money', status: 'partial', gap: 'Live inbox + sort mutation when household active' },
  { key: 'debt', section: 'SCHULDEN', route: '/money/debts', navGroup: 'money', status: 'partial', gap: 'Freedom date hero + list; simulator simplified' },
  { key: 'fixed', section: 'VASTE LASTEN', route: '/money/fixed-costs', navGroup: 'money', status: 'partial', gap: 'In/out tabs + list' },

  { key: 'groeihome', section: 'PORTAL OVERZICHT', route: '/growth', navGroup: 'growth', status: 'shell', gap: 'PortalHub growth config' },
  { key: 'goals', section: 'DOELEN', route: '/growth/goals', navGroup: 'growth', status: 'partial', gap: 'Goal cards + tabs' },
  { key: 'income', section: 'MIJN INKOMEN', route: '/growth/income', navGroup: 'growth', status: 'partial', gap: 'Income hero + levers' },
  { key: 'learn', section: 'WAT IK LEER', route: '/growth/learn', navGroup: 'growth', status: 'partial', gap: 'Book list states' },
  { key: 'board', section: 'BORD / BOARD', route: '/growth/board', navGroup: 'growth', status: 'partial', gap: 'Holdings groups + filters from mock; create via URL modal stub; live asset API TBD' },

  { key: 'energiehome', section: 'PORTAL OVERZICHT', route: '/energy', navGroup: 'energy', status: 'shell', gap: 'PortalHub energy config' },
  { key: 'week', section: 'MIJN WEEK', route: '/energy/week', navGroup: 'energy', status: 'partial', gap: '168h bar + sleep slider' },
  { key: 'sleep', section: 'MIJN SLAAP', route: '/energy/sleep', navGroup: 'energy', status: 'partial', gap: 'Sleep stage breakdown' },
  { key: 'train', section: 'TRAINEN', route: '/energy/train', navGroup: 'energy', status: 'partial', gap: 'Session toggles' },
  { key: 'food', section: 'VOEDING', route: '/energy/food', navGroup: 'energy', status: 'partial', gap: 'Macro rings + meals' },

  { key: 'zielhome', section: 'PORTAL OVERZICHT', route: '/soul', navGroup: 'soul', status: 'shell', gap: 'PortalHub soul config' },
  { key: 'mind', section: 'STILTE', route: '/soul/mind', navGroup: 'soul', status: 'partial', gap: 'Stillness timer' },
  { key: 'grat', section: 'DANKBAARHEID', route: '/soul/gratitude', navGroup: 'soul', status: 'partial', gap: 'Weekly gratitude list' },
  { key: 'intent', section: 'INTENTIE', route: '/soul/intent', navGroup: 'soul', status: 'partial', gap: 'Intention field' },
  { key: 'chakra', section: 'CENTRA / CHAKRA', route: '/soul/chakra', navGroup: 'soul', status: 'partial', gap: 'Centre picker + CTA' },

  { key: 'settings', section: 'INSTELLINGEN', route: '/settings', navGroup: 'settings', status: 'shell', gap: 'Sprint F: nested /settings + /settings/[section] pages + SettingsShell rail; account/jars/bank/systeem/export panels complete; groei/energie/ziel/plan stubs (fields TBD).' },

  { key: 'onboarding', section: '(overlay)', route: '/onboarding', navGroup: 'overlay', status: 'partial', gap: '4-step overlay → household.onboard API; design slider preview pending Phase 7' },
  { key: 'locked', section: '(plan gate)', route: '—', navGroup: 'overlay', status: 'shell', gap: 'LockedGate + subnav lock icons' },
  { key: 'sheets', section: '(FAB + create/edit routes)', route: '—', navGroup: 'overlay', status: 'shell', gap: 'URL modals: /create + /update/[id] with @modal intercept; FAB Links; stubs for session/asset/move' },
];

export const DESIGN_GROUP_ENTRY: Record<string, string> = {
  home: '/',
  geld: '/money/overview',
  groeien: '/growth',
  energie: '/energy',
  ziel: '/soul',
};
