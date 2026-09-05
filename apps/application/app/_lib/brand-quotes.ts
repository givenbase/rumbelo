/**
 * Brand quote bank for product UI (auth, marketing chrome).
 * Source of truth for meaning: docs/brand/quotes.md
 * Currency-agnostic — never lock lines to euro/dollar symbols.
 *
 * AUTH_QUOTES must stay distinct from each other — one clear angle per panel,
 * not four riffs on “where it went.”
 */

export type BrandQuote = {
    /** Short uppercase eyebrow */
    eyebrow: string;
    /** Display headline */
    headline: string;
    /** Supporting sentence */
    support: string;
};

/** Primary tagline — logo lockups */
export const BRAND_TAGLINE = 'Stop wondering where it went.';

/** Core three (approved) */
export const BRAND_CORE = [
    'Stop wondering where it went.',
    'Money leaves. You’ll know why.',
    'No more mystery spending.',
] as const;

/**
 * Rotating auth aside — four different jobs:
 * 1) money mystery  2) the system  3) who it’s for  4) life beyond money
 */
export const AUTH_QUOTES: readonly BrandQuote[] = [
    {
        eyebrow: 'The money picture',
        headline: 'Stop wondering where it went.',
        support: 'Money leaves. You’ll know why. No more mystery spending.',
    },
    {
        eyebrow: 'How it works',
        headline: 'Split first. Spend second.',
        support:
            'Income lands and gets a job across six jars before you touch it. Paycheck in. Picture clear.',
    },
    {
        eyebrow: 'Who it’s for',
        headline: 'Built for people who are doing well — and for people who are ready to.',
        support: 'Don’t chase the number. Own the direction. Ambition with a map — not a guess.',
    },
    {
        eyebrow: 'Bigger than the balance',
        headline: 'Assign the money. Protect the energy. Keep the why.',
        support:
            'Money, growth, energy, and soul — one calm overview. A tired head spends; a rested head decides.',
    },
] as const;

export const AUTH_SIGN_IN = {
    title: 'Welcome back',
    subtitle: 'Stop wondering where it went.',
} as const;

export const AUTH_SIGN_UP = {
    title: 'Stop wondering where it went.',
    subtitle: 'Six jars. One calm overview.',
} as const;
