import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { ContractRouterClient } from '@orpc/contract';
import { contract } from '../routers';

export type AppClient = ContractRouterClient<typeof contract>;

export interface CreateClientOptions {
    /** Base URL of the backend's oRPC mount, e.g. https://api.rumbelo.com/rpc */
    url: string;
    /** Extra headers per request — used to forward cookies during SSR. */
    headers?: () => Record<string, string> | Promise<Record<string, string>>;
    fetch?: typeof globalThis.fetch;
}

/**
 * Builds a fully typed client from the contract. Credentials are included so the
 * better-auth session cookie rides along; the backend is the only thing that ever
 * sees a token.
 */
export function createClient(options: CreateClientOptions): AppClient {
    const link = new RPCLink({
        url: options.url,
        headers: options.headers,
        fetch: (request, init) =>
            (options.fetch ?? globalThis.fetch)(request, { ...init, credentials: 'include' }),
    });
    return createORPCClient(link);
}
