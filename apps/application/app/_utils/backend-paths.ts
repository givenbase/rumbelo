/** Fixed backend mounts — do not put these in `.env`. */
export const BACKEND_RPC_PATH = '/rpc';
export const BACKEND_AUTH_PATH = '/api/auth';

export function joinBackendOrigin(origin: string, path: string): string {
    return `${origin.replace(/\/$/, '')}${path}`;
}
