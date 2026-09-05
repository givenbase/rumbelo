/**
 * Application auth helpers — product sign-in + session only.
 * Sign-up / verify / forgot-password live on DOMAIN_WEB.
 */

import { createAuthClient } from 'better-auth/react';

import { organizationClient } from 'better-auth/client/plugins';

import { env } from '@/app/_utils/get-env';

/** Align client poll with Nest `session.cookieCache.maxAge` (5 minutes). */
const BETTER_AUTH_SESSION_REFETCH_INTERVAL_SEC = 5 * 60;

const client = createAuthClient({
    baseURL: env.NEXT_PUBLIC_DOMAIN_APP,
    plugins: [organizationClient()],
    sessionOptions: {
        refetchInterval: BETTER_AUTH_SESSION_REFETCH_INTERVAL_SEC,
        refetchOnWindowFocus: true,
        refetchWhenOffline: false,
    },
});

export const signIn = client.signIn;
export const signOut = client.signOut;
export const useSession = client.useSession;
export const sendVerificationEmail = client.sendVerificationEmail;

export async function updateUser(data: { name?: string; image?: string | null }) {
    return client.updateUser(data);
}

export async function changePassword(data: {
    currentPassword: string;
    newPassword: string;
    revokeOtherSessions?: boolean;
}) {
    return client.changePassword(data);
}

export async function setActiveOrganization(organizationId: string) {
    await client.organization.setActive({ organizationId });
}

export async function listOrganizations() {
    return client.organization.list();
}

export async function updateOrganization(organizationId: string, data: { name?: string }) {
    await client.organization.update({ organizationId, data });
}

export type Session = NonNullable<ReturnType<typeof useSession>['data']>;

export function activeHouseholdId(session: Session | null | undefined): string | null {
    if (!session) return null;
    return session.session?.activeOrganizationId ?? null;
}

export function webOrigin(): string {
    return env.NEXT_PUBLIC_DOMAIN_WEB.replace(/\/$/, '');
}

export function webSignUpUrl(): string {
    return `${webOrigin()}/sign-up`;
}

export function webVerifyUrl(email?: string): string {
    const url = new URL('/verify', `${webOrigin()}/`);
    if (email) url.searchParams.set('email', email);
    return url.toString();
}

export function webForgotPasswordUrl(): string {
    return `${webOrigin()}/forgot-password`;
}
