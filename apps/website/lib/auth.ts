/**
 * Website Better Auth client — acquisition / recovery only.
 *
 * Same-origin `/api/auth` proxies to Nest so cookies bind to DOMAIN_WEB.
 */

import { createAuthClient } from 'better-auth/react';

import { env } from '@/lib/get-env';

const client = createAuthClient({
    baseURL: env.NEXT_PUBLIC_DOMAIN_WEB,
});

export const signUp = client.signUp;
export const signIn = client.signIn;
export const sendVerificationEmail = client.sendVerificationEmail;
export const requestPasswordReset = client.requestPasswordReset;
export const resetPassword = client.resetPassword;
