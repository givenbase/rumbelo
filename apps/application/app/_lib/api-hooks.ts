/**
 * TanStack Query utils + thin hooks matching the old `@rumbelo/contracts/react` API.
 */

'use client';

import { createAPIUtils } from '@rumbelo/contracts/react';

import { api } from './api';

export const apiUtils = createAPIUtils(api);

/** Prefer importing `apiUtils` directly; kept for existing call sites. */
export function useApi() {
    return apiUtils;
}

/** Prefer importing `api` from `./api`; kept for existing call sites. */
export function useApiClient() {
    return api;
}
