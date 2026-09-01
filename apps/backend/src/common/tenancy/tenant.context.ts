import { AsyncLocalStorage } from 'node:async_hooks';

export interface TenantContext {
  userId: string;
  /** Null only during household.onboard (user authenticated, org not yet created). */
  householdId: string | null;
  role: 'OWNER' | 'PARTNER' | 'VIEWER';
}

/**
 * Request-scoped tenant identity. Held in AsyncLocalStorage so services never
 * need householdId threaded through every signature — and so a service that
 * forgets to filter still cannot see another household's rows, because the
 * repository helper below reads from here rather than from arguments.
 */
export const tenantStorage = new AsyncLocalStorage<TenantContext>();

/** Incoming request headers for better-auth server API calls (createOrganization, etc.). */
export const authHeadersStorage = new AsyncLocalStorage<Headers>();

export function currentAuthHeaders(): Headers {
  return authHeadersStorage.getStore() ?? new Headers();
}

export function currentTenant(): TenantContext {
  const ctx = tenantStorage.getStore();
  if (!ctx) {
    throw new Error(
      'No tenant context. A household-scoped query ran outside a request — ' +
        'wrap background jobs in tenantStorage.run().',
    );
  }
  return ctx;
}

export function currentHouseholdId(): string {
  const id = currentTenant().householdId;
  if (!id) throw new Error('No household in tenant context');
  return id;
}

export function currentUserId(): string {
  return currentTenant().userId;
}
