/**
 * Better Auth email links use `baseURL` (Nest public origin). Frontends proxy
 * `/api/auth` on their own origin so cookies bind correctly — rewrite the host.
 */
export function rewriteBetterAuthUrlToOrigin(authUrl: string, publicOrigin: string): string {
    const parsed = new URL(authUrl);
    const origin = publicOrigin.replace(/\/$/, '');
    return `${origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
}
