/**
 * Marketing oRPC client — same-origin proxy so Better Auth cookies stay first-party.
 * Used only for light reads (household settings / plan) on the landing page.
 */

import { createClient, type AppClient } from '@rumtelo/contracts';

import { getClientHouseholdHeaders } from '@/lib/household-api-context';
import { env } from '@/lib/get-env';

function getApiBaseURL(): string {
    const origin =
        typeof window !== 'undefined' ? window.location.origin : env.NEXT_PUBLIC_DOMAIN_WEB;
    return `${origin.replace(/\/$/, '')}/api/backend`;
}

export const api: AppClient = createClient({
    url: getApiBaseURL(),
    headers: getClientHouseholdHeaders,
    logErrors: process.env.NODE_ENV === 'development',
});
