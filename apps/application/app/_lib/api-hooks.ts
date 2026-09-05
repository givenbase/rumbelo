/**
 * TanStack Query utils + thin hooks matching the old `@rumbelo/contracts/react` API.
 */

'use client';

import type { AppClient } from '@rumbelo/contracts';
import { createAPIUtils, type APIUtils } from '@rumbelo/contracts/react';

import { api } from './api';

export const apiUtils: APIUtils = createAPIUtils(api);

/** Prefer importing `apiUtils` directly; kept for existing call sites. */
export function useApi(): APIUtils {
    return apiUtils;
}

/** Prefer importing `api` from `./api`; kept for existing call sites. */
export function useApiClient(): AppClient {
    return api;
}
