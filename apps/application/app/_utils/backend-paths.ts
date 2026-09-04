/** Fixed backend mounts — do not put these in `.env`. */
/** Same-origin Next proxy prefix → Nest procedure root. */
export const BACKEND_RPC_PROXY_PATH = '/api/backend';
export const BACKEND_AUTH_PATH = '/api/auth';

export function joinBackendOrigin(origin: string, path: string): string {
    const base = origin.replace(/\/$/, '');
    if (!path) return base;
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
