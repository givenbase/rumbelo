import { PlanKey } from '@rumtelo/contracts';

/** Shared password for all demo / E2E personas (better-auth min length 12). */
export const DEMO_PASSWORD = 'RumteloDemo1!';

export type DemoPersona = 'basic' | 'plus' | 'max';

export type DemoAccount = {
    persona: DemoPersona;
    planKey: PlanKey;
    email: string;
    name: string;
    householdName: string;
    slug: string;
    why: string;
};

/**
 * Seeded demo accounts — also used by sign-in chips and apps/e2e.
 * Domain: @rumtelo.com
 */
export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
    {
        persona: 'basic',
        planKey: PlanKey.BASIC,
        email: 'basic@rumtelo.com',
        name: 'Basic Demo',
        householdName: 'Basic huishouden',
        slug: 'demo-basic',
        why: 'Eerst overzicht — rust in mijn hoofd zonder te veel tegelijk.',
    },
    {
        persona: 'plus',
        planKey: PlanKey.PLUS,
        email: 'plus@rumtelo.com',
        name: 'Plus Demo',
        householdName: 'Freelancer Plus',
        slug: 'demo-plus',
        why: 'Freelance inkomen in potten, schulden onder controle, week op orde.',
    },
    {
        persona: 'max',
        planKey: PlanKey.MAX,
        email: 'max@rumtelo.com',
        name: 'Max Demo',
        householdName: 'Max Invest',
        slug: 'demo-max',
        why: 'Bedrijf + beleggen — Financial Freedom pot vullen zonder te gokken.',
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
