/**
 * Portal overview configs — shapes and copy from the design's HUBS block
 * (Kluis Finance App.dc.html:3478-3527), values derived from mock fixtures.
 */
import type { PortalHubProps } from '@/components/features/home/portal-hub';
import { formatMoney } from '@rumbelo/utils';
import {
  INCOME_SOURCES,
  mockDebts,
  mockFixedCosts,
  mockGoals,
  mockJars,
} from '@/app/_mock';

const NET = INCOME_SOURCES.reduce((s, i) => s + i.amount, 0);
const SPENT_TOTAL = mockJars.reduce((s, j) => s + j.spent, 0);
const JARS_ON = mockJars.filter((j) => !j.overspent).length;
const FIXED_PM = mockFixedCosts.reduce((s, f) => s + Math.abs(f.amount), 0);
const DEBT_BAL = mockDebts.reduce((s, d) => s + d.balance, 0);
const INCOME_PM = NET;
const GOALS_ON = mockGoals.length;
const GOALS_RING = Math.round(
  (mockGoals.reduce((t, g) => t + Math.min(1, g.saved / g.target), 0) / mockGoals.length) * 100,
);

function spark(vals: number[]): number[] {
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals, 0);
  const span = Math.max(1, max - min);
  return vals.map((v) => Math.max(6, Math.round(((v - min) / span) * 100)));
}

export const moneyPortalHub: PortalHubProps = {
  tint: 'var(--color-jar-give)',
  icon: '◈',
  eyebrow: 'Geld · deze maand',
  title: 'Hoe je geld beweegt.',
  line: 'Vier plekken, één vraag per plek. Ga verder waar je was.',
  coach: {
    dot: 'var(--color-warning)',
    kind: 'ÉÉN BEWEGING',
    text: 'Necessity liep over de lijn. Schuif wat los is in Necessity en de maand is weer schoon.',
    cta: 'Open de potten',
    href: '/money/jars',
  },
  cards: [
    {
      name: 'Potten',
      value: `${JARS_ON} / ${mockJars.length}`,
      note: 'potten op koers deze maand',
      color: 'var(--color-jar-nec)',
      chart: { kind: 'ring', pct: Math.round((JARS_ON / mockJars.length) * 100) },
      href: '/money/jars',
    },
    {
      name: 'Uitgaven',
      value: formatMoney(SPENT_TOTAL),
      note: 'geboekt deze maand',
      color: 'var(--color-jar-play)',
      chart: { kind: 'bars', bars: spark([620, 810, 540, 930, 700, 880, SPENT_TOTAL / 100]) },
      delta: { mark: '↓', text: '8% vs vorige maand', positive: true },
      href: '/money/transactions',
    },
    {
      name: 'Schulden',
      value: '03-2029',
      note: 'de maand dat je vrij bent',
      color: 'var(--color-danger)',
      chart: { kind: 'bars', bars: spark([9200, 8100, 7400, 6300, 5200, 4100, DEBT_BAL / 100]) },
      delta: { mark: '↓', text: '4% vs vorige maand', positive: true },
      href: '/money/debts',
    },
    {
      name: 'Vast',
      value: formatMoney(FIXED_PM),
      note: 'vaste lasten per maand',
      color: 'var(--color-jar-nec)',
      chart: { kind: 'ring', pct: Math.round(((FIXED_PM + DEBT_BAL / 12) / INCOME_PM) * 100) },
      delta: { mark: '↓', text: '2% vs vorige maand', positive: true },
      href: '/money/fixed-costs',
    },
  ],
};

export const growthPortalHub: PortalHubProps = {
  tint: 'var(--color-jar-lts)',
  icon: '↗',
  eyebrow: 'Groei · op termijn',
  title: 'Waar je geld staat.',
  line: 'Waar je op mikt, wat je verdient, wat je leert, wat je bezit.',
  coach: {
    dot: 'var(--color-accent)',
    kind: 'DE HENDEL',
    text: 'Bezuinigen heeft een bodem; meer verdienen niet. Inkomen is de snellere hendel.',
    cta: 'Open inkomen',
    href: '/growth/income',
  },
  cards: [
    {
      name: 'Doelen',
      value: String(GOALS_ON),
      note: 'doelen onderweg',
      color: 'var(--color-jar-lts)',
      chart: { kind: 'ring', pct: GOALS_RING },
      href: '/growth/goals',
    },
    {
      name: 'Inkomen',
      value: formatMoney(INCOME_PM),
      note: 'per maand nu',
      color: 'var(--color-accent)',
      chart: { kind: 'bars', bars: spark([2900, 3150, 3400, 3650, 3900, 4100, INCOME_PM / 100]) },
      delta: { mark: '↑', text: '2% vs vorige maand', positive: true },
      href: '/growth/income',
    },
    {
      name: 'Leren',
      value: '1',
      note: 'boek waar je nu in zit',
      color: 'var(--color-jar-edu)',
      chart: { kind: 'ring', pct: 25 },
      href: '/growth/learn',
    },
    {
      name: 'Vermogen',
      value: formatMoney(52_000_00),
      note: 'echt van jou',
      color: 'var(--color-jar-ff)',
      chart: { kind: 'bars', bars: spark([31000, 36000, 41000, 47000, 52000, 57000, 52000]) },
      delta: { mark: '↓', text: '9% vs vorige maand', positive: false },
      href: '/growth/board',
    },
  ],
};

export const energyPortalHub: PortalHubProps = {
  tint: 'var(--color-jar-play)',
  icon: '✳\uFE0E',
  eyebrow: 'Energie · je capaciteit',
  title: 'De vloer onder elke beslissing.',
  line: 'Uren, slaap, training, voeding. Wat de geldbeslissingen mogelijk maakt.',
  coach: {
    dot: 'var(--color-success)',
    kind: 'STEVIGE VLOER',
    text: '8 uur per nacht en 3 van 4 sessies gedaan. Dit is de vloer waar je geldbeslissingen op staan — die houdt.',
    cta: 'Open je week',
    href: '/energy/week',
  },
  cards: [
    {
      name: 'Week',
      value: '40u',
      note: 'uren die jij stuurt',
      color: 'var(--color-accent)',
      chart: { kind: 'ring', pct: Math.round((40 / 168) * 100) },
      href: '/energy/week',
    },
    {
      name: 'Slaap',
      value: '8u',
      note: 'per nacht',
      color: 'var(--color-jar-lts)',
      chart: { kind: 'bars', bars: spark([7, 6.5, 8, 7.5, 6, 8.5, 8].map((h) => h * 10)) },
      delta: { mark: '↑', text: '11% vs vorige maand', positive: true },
      href: '/energy/sleep',
    },
    {
      name: 'Trainen',
      value: '3 / 4',
      note: 'sessies deze week',
      color: 'var(--color-jar-ff)',
      chart: { kind: 'ring', pct: 75 },
      delta: { mark: '↑', text: '33% vs vorige maand', positive: true },
      href: '/energy/train',
    },
    {
      name: 'Voeding',
      value: '96g',
      note: 'eiwit vandaag',
      color: 'var(--color-jar-play)',
      chart: { kind: 'ring', pct: 68 },
      href: '/energy/food',
    },
  ],
};

export const soulPortalHub: PortalHubProps = {
  tint: 'var(--color-portal-soul)',
  icon: '✦',
  eyebrow: 'Ziel · het waarom',
  title: 'Het waarom onder de cijfers.',
  line: 'Zonder dit is regie alleen boekhouden.',
  coach: {
    dot: 'var(--color-success)',
    kind: 'HOU VOL',
    text: '4 dagen stilte op rij. Dit is de goedkoopste pot die er is: het kost geen geld en beschermt alle andere.',
    cta: 'Open stilte',
    href: '/soul/mind',
  },
  cards: [
    {
      name: 'Stilte',
      value: '4d',
      note: 'dagen op rij',
      color: 'var(--color-portal-soul)',
      chart: { kind: 'bars', bars: spark([10, 10, 6, 10, 10, 10, 12]) },
      delta: { mark: '↑', text: '100% vs vorige maand', positive: true },
      href: '/soul/mind',
    },
    {
      name: 'Dank',
      value: '3',
      note: 'dingen genoteerd',
      color: 'var(--color-jar-give)',
      chart: { kind: 'ring', pct: 100 },
      delta: { mark: '↓', text: '40% vs vorige maand', positive: false },
      href: '/soul/gratitude',
    },
    {
      name: 'Intentie',
      value: 'gezet',
      note: 'voor deze week',
      color: 'var(--color-accent)',
      chart: { kind: 'ring', pct: 100 },
      href: '/soul/intent',
    },
    {
      name: 'Centra',
      value: '1',
      note: 'centrum benoemd vandaag',
      color: 'var(--color-jar-edu)',
      chart: { kind: 'ring', pct: 14 },
      href: '/soul/chakra',
    },
  ],
};
