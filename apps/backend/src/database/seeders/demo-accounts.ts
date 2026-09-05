import { PlanKey } from '@rumbelo/contracts';

/** Shared password for all demo / E2E personas (better-auth min length 12). */
export const DEMO_PASSWORD = 'RumbeloDemo1!';

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
 * Domain: @rumbelo.com
 */
export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
    {
        persona: 'basic',
        planKey: PlanKey.BASIC,
        email: 'basic@rumbelo.com',
        name: 'Basic Demo',
        householdName: 'Basic huishouden',
        slug: 'demo-basic',
        why: 'Eerst overzicht — rust in mijn hoofd zonder te veel tegelijk.',
    },
    {
        persona: 'plus',
        planKey: PlanKey.PLUS,
        email: 'plus@rumbelo.com',
        name: 'Plus Demo',
        householdName: 'Freelancer Plus',
        slug: 'demo-plus',
        why: 'Freelance inkomen in potten, schulden onder controle, week op orde.',
    },
    {
        persona: 'max',
        planKey: PlanKey.MAX,
        email: 'max@rumbelo.com',
        name: 'Max Demo',
        householdName: 'Max Invest',
        slug: 'demo-max',
        why: 'Bedrijf + beleggen — Financial Freedom pot vullen zonder te gokken.',
    },
] as const;
