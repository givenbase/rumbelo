/**
 * Rewrites Set-Cookie headers from the backend Better Auth API when proxied through
 * a Next.js app (`/api/auth/[...all]`).
 *
 * Development (localhost:3000):
 * - Strip `Domain=` so the cookie binds to the app origin (not DOMAIN_BACK).
 * - SameSite=Lax is fine because the browser talks to the same origin as the proxy.
 *
 * Production:
 * - Preserve Domain attributes when cross-subdomain cookies are configured later.
 *
 * @see https://www.better-auth.com/docs/concepts/cookies
 */

export function rewriteBetterAuthSetCookie(cookieValue: string): string {
    const parts = cookieValue.split(';').map(part => part.trim());

    if (process.env.NODE_ENV === 'development') {
        return parts
            .filter(part => !part.toLowerCase().startsWith('domain='))
            .join('; ');
    }

    return parts.join('; ');
}

