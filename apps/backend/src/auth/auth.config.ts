import { betterAuth } from 'better-auth';
import { organization, twoFactor } from 'better-auth/plugins';
import { Pool } from 'pg';

import type { Env } from '../common/config/env.config.js';

import { householdAccessControl, householdRoles } from './access-control.config.js';

/**
 * better-auth owns its own tables (user, session, account, verification,
 * organization, member, invitation) and migrates them with its CLI. We hand it a
 * raw pg Pool rather than mapping MikroORM entities over the same tables, so auth
 * state has exactly one writer.
 *
 * The organization plugin *is* our Household: it gives invitations, roles and an
 * active-organization on the session for free, which is precisely what couples
 * sharing a budget need.
 */
export function createAuth(env: Env) {
    const pool = new Pool({
        connectionString: env.DATABASE_URL,
        ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
    });

    return betterAuth({
        database: pool,
        secret: env.BETTER_AUTH_SECRET,
        baseURL: env.DOMAIN_BACK,
        trustedOrigins: [env.DOMAIN_APP, env.DOMAIN_WEB],

        emailAndPassword: {
            enabled: true,
            minPasswordLength: 12,
            requireEmailVerification: env.NODE_ENV === 'production',
        },

        session: {
            expiresIn: 60 * 60 * 24 * 30,
            updateAge: 60 * 60 * 24,
            cookieCache: { enabled: true, maxAge: 60 * 5 },
        },

        account: {
            accountLinking: { enabled: true },
        },

        plugins: [
            organization({
                ac: householdAccessControl,
                roles: householdRoles,
                allowUserToCreateOrganization: true,
                organizationLimit: 5,
                creatorRole: 'owner',
                membershipLimit: 10,
            }),
            // A finance app should not treat second-factor as optional plumbing.
            twoFactor({ issuer: 'Rumbelo' }),
        ],

        advanced: {
            cookiePrefix: 'rumbelo',
            useSecureCookies: env.NODE_ENV === 'production',
            defaultCookieAttributes: {
                sameSite: 'lax',
                httpOnly: true,
            },
        },
    });
}

export type Auth = ReturnType<typeof createAuth>;
