/**
 * Canonical map: landing section → build status.
 *
 * The original `design/Kluis Landing.dc.html` was a money-only landing. The current
 * page follows the Rumtelo brand arc instead (docs/brand/quotes.md → "How to use"):
 * money punch → problem → four portals → the loop → the Coach → principles → jars →
 * why we exist → pricing → FAQ → sign-up. Copy lives in `lib/landing-content.ts`.
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
    {
        id: 'header',
        anchor: 'header',
        label: 'Sticky nav + theme + sign-in + CTA',
        status: 'shell',
        gap: 'Anchor nav only; product CTAs go to DOMAIN_APP',
    },
    {
        id: 'hero',
        anchor: 'hero',
        label: 'Hero — money punch + live split demo + coach line',
        status: 'shell',
        gap: 'Demo loop uses static income; real data via API later',
    },
    {
        id: 'problem',
        anchor: '#problem',
        label: 'Why the picture goes missing (research)',
        status: 'shell',
        gap: 'Static copy from docs/research/money-awareness.md',
    },
    {
        id: 'portals',
        anchor: '#portals',
        label: 'Four portals + switch strip',
        status: 'shell',
        gap: 'Feature lines mirror FEATURES in @rumtelo/contracts by hand',
    },
    {
        id: 'loop',
        anchor: '#loop',
        label: 'The loop — five steps',
        status: 'shell',
        gap: 'Static copy; bank sync line says "coming"',
    },
    {
        id: 'coach',
        anchor: '#coach',
        label: 'The Coach — rendered mock feed',
        status: 'shell',
        gap: 'Mock messages; could read from the coach catalog later',
    },
    {
        id: 'principles',
        anchor: '#principles',
        label: 'Four principles (NL + EN)',
        status: 'shell',
        gap: 'Static copy from docs/product/principles.md',
    },
    {
        id: 'jars',
        anchor: '#jars',
        label: 'Six jars + split bar',
        status: 'shell',
        gap: 'Static copy',
    },
    {
        id: 'why',
        anchor: '#why',
        label: 'Why Rumtelo exists + books + roadmap',
        status: 'shell',
        gap: 'Founder note + book lineage; legal disclaimer on independence',
    },
    {
        id: 'proof',
        anchor: '#proof',
        label: 'Soft social proof (founders)',
        status: 'shell',
        gap: 'No fake testimonials — founders + place + language order',
    },
    {
        id: 'pricing',
        anchor: '#pricing',
        label: 'Pricing toggle + 3 plans',
        status: 'partial',
        gap: 'Plus/Max → plan intent → signup/verify/onboard → Stripe Checkout auto-starts',
    },
    {
        id: 'faq',
        anchor: '#faq',
        label: 'FAQ (native <details>)',
        status: 'shell',
        gap: 'Static copy',
    },
    {
        id: 'signup',
        anchor: '#signup',
        label: 'Create account hand-off form',
        status: 'partial',
        gap: 'Draft → /sign-up (Better Auth); terms/privacy linked',
    },
    {
        id: 'footer',
        anchor: 'footer',
        label: 'Trust cards + links',
        status: 'shell',
        gap: 'Legal routes live at /privacy /terms /data-processing',
    },
];
