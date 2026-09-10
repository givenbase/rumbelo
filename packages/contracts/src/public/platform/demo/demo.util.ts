/**
 * Seeded demo personas — shared by backend seed, sign-in chips, and E2E defaults.
 * Domain: @rumtelo.com. Plan and Stripe billing are read-only for these accounts.
 */

import { PlanKey } from '../../../backoffice/plan/enums';

/** Shared password for all demo / E2E personas (better-auth min length 12). */
export const DEMO_PASSWORD = 'RumteloDemo1!';

export type DemoPersona = 'basic' | 'plus' | 'max';

export type DemoAccount = {
    persona: DemoPersona;
    planKey: PlanKey;
    email: string;
    /** Sign-in chip label */
    label: string;
    name: string;
    householdName: string;
    slug: string;
    why: string;
};

export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
    {
        persona: 'basic',
        planKey: PlanKey.BASIC,
        email: 'basic@rumtelo.com',
        label: 'Basic',
        name: 'Basic Demo',
        householdName: 'Basic Household',
        slug: 'demo-basic',
        why: 'Breathing room — every euro is already spoken for.',
    },
    {
        persona: 'plus',
        planKey: PlanKey.PLUS,
        email: 'plus@rumtelo.com',
        label: 'Plus',
        name: 'Plus Demo',
        householdName: 'Freelancer Plus',
        slug: 'demo-plus',
        why: 'Break the rat race — stop living invoice to invoice.',
    },
    {
        persona: 'max',
        planKey: PlanKey.MAX,
        email: 'max@rumtelo.com',
        label: 'Max',
        name: 'Max Demo',
        householdName: 'Max Invest',
        slug: 'demo-max',
        why: 'Compound business profits into Financial Freedom without gambling.',
    },
] as const;

const DEMO_EMAILS = new Set(DEMO_ACCOUNTS.map(account => account.email.toLowerCase()));
const DEMO_HOUSEHOLD_SLUGS = new Set(DEMO_ACCOUNTS.map(account => account.slug));

/** Seeded demo personas — plan and Stripe billing are read-only. */
export function isDemoAccountEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    return DEMO_EMAILS.has(email.trim().toLowerCase());
}

export function isDemoHouseholdSlug(slug: string | null | undefined): boolean {
    if (!slug) return false;
    return DEMO_HOUSEHOLD_SLUGS.has(slug);
}
