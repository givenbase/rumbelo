/** Mirrors backend demo seed — used by sign-in chips (dev) and documented for E2E. */

export const DEMO_PASSWORD = 'RumbeloDemo1!';

export type DemoPersona = 'basic' | 'plus' | 'max';

export const DEMO_ACCOUNTS: readonly {
    persona: DemoPersona;
    email: string;
    label: string;
}[] = [
    { persona: 'basic', email: 'basic@rumbelo.com', label: 'Basic' },
    { persona: 'plus', email: 'plus@rumbelo.com', label: 'Plus' },
    { persona: 'max', email: 'max@rumbelo.com', label: 'Max' },
] as const;

const DEMO_EMAILS = new Set(DEMO_ACCOUNTS.map(a => a.email.toLowerCase()));

/** Seeded demo personas — plan and billing are read-only. */
export function isDemoAccountEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    return DEMO_EMAILS.has(email.trim().toLowerCase());
}
