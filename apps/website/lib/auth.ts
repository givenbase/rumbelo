/**
 * Website Better Auth client — acquisition / recovery + marketing session.
 *
 * Same-origin `/api/auth` proxies to Nest so cookies bind to DOMAIN_WEB.
 * In staging/prod, cross-subdomain cookies share the session with the app.
 */

import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';

import { env } from '@/lib/get-env';

/** Align client poll with Nest `session.cookieCache.maxAge` (5 minutes). */
const BETTER_AUTH_SESSION_REFETCH_INTERVAL_SEC = 5 * 60;

const client = createAuthClient({
    baseURL: env.NEXT_PUBLIC_DOMAIN_WEB,
    plugins: [organizationClient()],
    sessionOptions: {
        refetchInterval: BETTER_AUTH_SESSION_REFETCH_INTERVAL_SEC,
        refetchOnWindowFocus: true,
        refetchWhenOffline: false,
    },
});

export const signUp = client.signUp;
export const signIn = client.signIn;
export const signOut = client.signOut;
export const sendVerificationEmail = client.sendVerificationEmail;
export const requestPasswordReset = client.requestPasswordReset;
export const resetPassword = client.resetPassword;
export const useSession = client.useSession;

/** BA organization plugin — SDK still says organization; Rumtelo calls it household. */
export async function setActiveOrganization(organizationId: string) {
    await client.organization.setActive({ organizationId });
}

export async function listOrganizations() {
    return client.organization.list();
}

export type Session = NonNullable<ReturnType<typeof useSession>['data']>;

/**
 * Active household for this session.
 * Better Auth exposes `activeOrganizationId` (SDK name).
 */
export function activeHouseholdId(session: Session | null | undefined): string | null {
    if (!session) return null;
    return session.session?.activeOrganizationId ?? null;
}

/** Better Auth `user.id` — opaque AuthId. */
export function sessionUserId(session: Session | null | undefined): string | null {
    return session?.user?.id ?? null;
}
