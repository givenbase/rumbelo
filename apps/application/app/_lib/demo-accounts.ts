/** Mirrors backend demo seed — used by sign-in chips (dev) and documented for E2E. */

export const DEMO_PASSWORD = 'RumteloDemo1!';

export type DemoPersona = 'basic' | 'plus' | 'max';

export const DEMO_ACCOUNTS: readonly {
    persona: DemoPersona;
    email: string;
    label: string;
}[] = [
    { persona: 'basic', email: 'basic@rumtelo.com', label: 'Basic' },
    { persona: 'plus', email: 'plus@rumtelo.com', label: 'Plus' },
    { persona: 'max', email: 'max@rumtelo.com', label: 'Max' },
] as const;

const DEMO_EMAILS = new Set(DEMO_ACCOUNTS.map(account => account.email.toLowerCase()));

/** Seeded demo personas — plan and billing are read-only. */
export function isDemoAccountEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    return DEMO_EMAILS.has(email.trim().toLowerCase());
}
