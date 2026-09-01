import { createAuthClient } from 'better-auth/react';

import { organizationClient } from 'better-auth/client/plugins';

import { backendAuthUrl } from '@/app/_utils/portal-urls';

const client = createAuthClient({
    baseURL: backendAuthUrl(),
    plugins: [organizationClient()],
});

export const signIn = client.signIn;
export const signUp = client.signUp;
export const signOut = client.signOut;
export const useSession = client.useSession;

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

export async function updateOrganization(organizationId: string, data: { name?: string }) {
    await client.organization.update({ organizationId, data });
}

export type Session = NonNullable<ReturnType<typeof useSession>['data']>;

export function activeHouseholdId(session: Session | null | undefined): string | null {
    if (!session) return null;
    return session.session?.activeOrganizationId ?? null;
}
