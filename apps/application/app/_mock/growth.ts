/** Growth-domain fixtures: doelen + vermogen holdings. */

export const mockGoals = [
  { id: 'g1', name: 'Emergency fund', icon: '🛟', target: 1_000_000, saved: 640_000, monthlyContribution: 25_000 },
  { id: 'g2', name: 'A place of my own', icon: '🏡', target: 3_500_000, saved: 420_000, monthlyContribution: 30_000 },
  { id: 'g3', name: 'Sabbatical', icon: '🌍', target: 800_000, saved: 95_000, monthlyContribution: 10_000 },
] as const;

/** Net-worth holdings — design Kluis Finance App.dc.html:2535-2541 (amounts in cents). */
export type HoldingKind = 'portfolio' | 'property' | 'business' | 'cash' | 'pension';

export const mockHoldings = [
  { id: 'h1', name: 'Wereldindexfonds', jarKey: 'FINANCIAL_FREEDOM', value: 1_420_000, flow: 4_200, kind: 'portfolio' as const, locked: false },
  { id: 'h2', name: 'Meltizo', jarKey: 'FINANCIAL_FREEDOM', value: 2_200_000, flow: 10_000, kind: 'business' as const, locked: false },
  { id: 'h3', name: 'Savings buffer', jarKey: 'LONG_TERM_SAVINGS', value: 650_000, flow: 2_600, kind: 'cash' as const, locked: false },
  { id: 'h4', name: 'Crypto', jarKey: 'FINANCIAL_FREEDOM', value: 380_000, flow: 0, kind: 'portfolio' as const, locked: false },
  { id: 'h5', name: 'Employer pension', jarKey: 'FINANCIAL_FREEDOM', value: 1_860_000, flow: 0, kind: 'pension' as const, locked: true },
  { id: 'h6', name: 'Annuity', jarKey: 'LONG_TERM_SAVINGS', value: 420_000, flow: 0, kind: 'pension' as const, locked: true },
] as const;
