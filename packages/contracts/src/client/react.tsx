'use client';

import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createClient, type AppClient, type CreateClientOptions } from './index';

type Utils = ReturnType<typeof createTanstackQueryUtils<AppClient>>;

const ApiContext = createContext<{ client: AppClient; api: Utils } | null>(null);

export function ApiProvider({
  children,
  ...options
}: CreateClientOptions & { children: ReactNode }) {
  const value = useMemo(() => {
    const client = createClient(options);
    return { client, api: createTanstackQueryUtils(client) };
    // Recreating the client on every render would reset in-flight requests.
  }, [options.url]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

/** Query/mutation option factories, e.g. useQuery(api.jars.balances.queryOptions({ input })). */
export function useApi(): Utils {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used inside <ApiProvider>');
  return ctx.api;
}

/** The raw client, for imperative calls outside React Query. */
export function useApiClient(): AppClient {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApiClient must be used inside <ApiProvider>');
  return ctx.client;
}
