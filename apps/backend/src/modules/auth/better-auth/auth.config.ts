import { betterAuth } from 'better-auth';
import { organization, twoFactor } from 'better-auth/plugins';
import { Pool } from 'pg';

import type { Env } from '../../../common/config/env.config';
import { EmailService } from '../../backoffice/communication/email';

import { householdAccessControl, householdRoles } from './access-control.config';
import { rewriteBetterAuthUrlToOrigin } from './auth-url.util';

/** Better Auth verification links expire after this many hours (product copy). */
const EMAIL_VERIFICATION_EXPIRES_HOURS = 48;
/** Better Auth password-reset tokens — default is 1 hour. */
const PASSWORD_RESET_EXPIRES_HOURS = 1;

function authUserFirstName(user: { name?: string | null; email: string }): string {
    const fromName = user.name?.trim().split(/\s+/)[0];
    if (fromName) return fromName;
    return user.email.split('@')[0] || 'there';
}

/**
 * better-auth owns and writes its tables (user, session, provider, verification,
 * organization, member, invitation, two_factor) and migrates them via
 * `pn auth:migrate`. The sibling folders here (user/, member/, …) map read-only
 * MikroORM entities over the same tables so the rest of the backend gets typed,
 * relational reads — better-auth stays the single writer (Galighticus pattern).
 *
 * Column names are snake_case like every other schema. better-auth is camelCase
 * internally, so each model maps its fields explicitly below. Plugin-added
 * columns (activeOrganizationId, twoFactorEnabled, …) are NOT covered by the
 * top-level `fields` — they must be mapped on the plugin's own `schema` option.
 *
 * The organization plugin *is* our Household: it gives invitations, roles and an
 * active-organization on the session for free, which is precisely what couples
 * sharing a budget need.
 *
 * Acquisition / recovery emails (verify, reset) land on DOMAIN_WEB; product
 * sessions bind on DOMAIN_APP via `/api/auth` proxies.
 */
export function createAuth(env: Env) {
    const pool = new Pool({
        connectionString: env.DATABASE_URL,
        ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
        /**
         * better-auth is schema-unaware, so its pool connects with search_path
         * pinned to the `auth` schema (Galighticus pattern). Its tables live
         * there, namespaced like every other domain — never in `public`.
         */
        options: '-c search_path=auth',
    });

    const emailService = new EmailService();
    const requireEmailVerification = env.EMAIL_VERIFICATION_ENABLED;
    const webOrigin = env.DOMAIN_WEB.replace(/\/$/, '');

    return betterAuth({
        database: pool,
        secret: env.BETTER_AUTH_SECRET,
        // Public origin — private DOMAIN_BACK is for service-to-service only.
        baseURL: env.DOMAIN_BACK_PUBLIC,
        trustedOrigins: [env.DOMAIN_APP, env.DOMAIN_WEB],

        emailAndPassword: {
            enabled: true,
            minPasswordLength: 12,
            requireEmailVerification,
            sendResetPassword: async ({ user, url }) => {
                // Fire-and-forget — avoid timing attacks on account enumeration.
                void emailService
                    .sendPasswordResetEmail({
                        to: user.email,
                        firstName: authUserFirstName(user),
                        resetUrl: rewriteBetterAuthUrlToOrigin(url, webOrigin),
                        expiresInHours: PASSWORD_RESET_EXPIRES_HOURS,
                    })
                    .then(sent => {
                        if (!sent) {
                            console.error('[Better Auth] Failed to send password reset email');
                        }
                    });
            },
        },

        // Docs: https://www.better-auth.com/docs/concepts/email
        // Required when requireEmailVerification / sendOnSignUp / client sendVerificationEmail.
        // Do NOT sendOnSignIn — every failed unverified login would spam verify emails.
        // Always send on sign-up so `/verify` is honest; hard-block only when flag is on.
        emailVerification: {
            sendOnSignUp: true,
            sendOnSignIn: false,
            autoSignInAfterVerification: true,
            sendVerificationEmail: async ({ user, url }) => {
                const sent = await emailService.sendEmailVerificationEmail({
                    to: user.email,
                    firstName: authUserFirstName(user),
                    verificationUrl: rewriteBetterAuthUrlToOrigin(url, webOrigin),
                    expiresInHours: EMAIL_VERIFICATION_EXPIRES_HOURS,
                });
                if (!sent) {
                    console.error('[Better Auth] Failed to send email verification email');
                }
            },
        },

        rateLimit: {
            enabled: true,
            window: 60,
            max: 100,
            customRules: {
                '/sign-in/email': { window: 60, max: 5 },
                '/send-verification-email': { window: 300, max: 2 },
                '/request-password-reset': { window: 300, max: 2 },
                '/forget-password': { window: 300, max: 2 },
            },
        },

        user: {
            fields: {
                emailVerified: 'email_verified',
                createdAt: 'created_at',
                updatedAt: 'updated_at',
            },
        },

        session: {
            expiresIn: 60 * 60 * 24 * 30,
            updateAge: 60 * 60 * 24,
            cookieCache: { enabled: true, maxAge: 60 * 5 },
            fields: {
                expiresAt: 'expires_at',
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                ipAddress: 'ip_address',
                userAgent: 'user_agent',
                userId: 'user_id',
            },
        },

        account: {
            accountLinking: { enabled: true },
            // better-auth's "account" is really the sign-in provider link
            // (password hash, OAuth tokens). Renamed to `provider` so the
            // `account` name stays free for Rumbelo's own profile data.
            modelName: 'provider',
            fields: {
                accountId: 'account_id',
                providerId: 'provider_id',
                userId: 'user_id',
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
                idToken: 'id_token',
                accessTokenExpiresAt: 'access_token_expires_at',
                refreshTokenExpiresAt: 'refresh_token_expires_at',
                createdAt: 'created_at',
                updatedAt: 'updated_at',
            },
        },

        verification: {
            fields: {
                expiresAt: 'expires_at',
                createdAt: 'created_at',
                updatedAt: 'updated_at',
            },
        },

        plugins: [
            organization({
                ac: householdAccessControl,
                roles: householdRoles,
                allowUserToCreateOrganization: true,
                organizationLimit: 5,
                creatorRole: 'owner',
                membershipLimit: 10,
                schema: {
                    organization: {
                        fields: { createdAt: 'created_at' },
                    },
                    member: {
                        fields: {
                            organizationId: 'organization_id',
                            userId: 'user_id',
                            createdAt: 'created_at',
                        },
                    },
                    invitation: {
                        fields: {
                            organizationId: 'organization_id',
                            inviterId: 'inviter_id',
                            expiresAt: 'expires_at',
                            createdAt: 'created_at',
                        },
                    },
                    // Session column owned by the organization plugin, not core session.fields.
                    session: {
                        fields: { activeOrganizationId: 'active_organization_id' },
                    },
                },
            }),
            // A finance app should not treat second-factor as optional plumbing.
            twoFactor({
                issuer: 'Rumbelo',
                schema: {
                    twoFactor: {
                        modelName: 'two_factor',
                        fields: {
                            backupCodes: 'backup_codes',
                            userId: 'user_id',
                            failedVerificationCount: 'failed_verification_count',
                            lockedUntil: 'locked_until',
                        },
                    },
                    // User column owned by the twoFactor plugin, not core user.fields.
                    user: {
                        fields: { twoFactorEnabled: 'two_factor_enabled' },
                    },
                },
            }),
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
