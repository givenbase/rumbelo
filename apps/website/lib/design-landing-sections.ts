/**
 * Canonical map: Landing design section → build status.
 *
 * Source of truth for layout/copy: `design/Kluis Landing.dc.html`
 * Companion app registry: `apps/application/lib/design-screens.ts`
 *   (Finance App: `design/Kluis Finance App.dc.html`)
 */

export type LandingSectionStatus = 'shell' | 'partial' | 'missing';

export interface LandingSection {
  id: string;
  anchor: string;
  label: string;
  status: LandingSectionStatus;
  gap: string;
}

export const LANDING_SECTIONS: LandingSection[] = [
  { id: 'header', anchor: 'header', label: 'Sticky nav + theme + CTA', status: 'shell', gap: 'Presentational only — no auth routing' },
  { id: 'hero', anchor: 'hero', label: 'Hero + floaters + ticker + demo', status: 'shell', gap: 'Demo loop uses static income; real data via API later' },
  { id: 'pillars', anchor: '#pillars', label: 'Four portals', status: 'shell', gap: 'Static copy' },
  { id: 'jars', anchor: '#jars', label: 'Six jar cards', status: 'shell', gap: 'Static copy' },
  { id: 'how', anchor: '#how', label: 'Five-step journey', status: 'shell', gap: 'Static copy; "Rumbelo does" column wired' },
  { id: 'coachGlance', anchor: 'coach', label: 'One glance every morning', status: 'shell', gap: 'Screenshot placeholder — swap image-slot when ready' },
  { id: 'whyExists', anchor: 'why', label: 'Why band quote', status: 'shell', gap: 'Static copy' },
  { id: 'pricing', anchor: '#pricing', label: 'Pricing toggle + 3 plans', status: 'shell', gap: 'Presentational — billing toggle is client state only' },
  { id: 'signup', anchor: 'signup', label: 'Create account form', status: 'shell', gap: 'Presentational — no backend wired; Better Auth + Stripe to connect' },
  { id: 'footer', anchor: 'footer', label: 'Trust cards + links', status: 'shell', gap: 'Placeholder hrefs; swap with real routes' },
];
