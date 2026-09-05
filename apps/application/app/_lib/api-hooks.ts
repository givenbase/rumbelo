/**
 * TanStack Query utils — Galighticus pattern.
 *
 * Import `createAPIUtils` only; let TypeScript infer the utils type here.
 * Do not re-export `APIUtils` from `@rumbelo/contracts/react` (TS7056 / dist collapse).
 */

'use client';

import type { AppClient } from '@rumbelo/contracts';
import { createAPIUtils } from '@rumbelo/contracts/react';

import { api } from './api';

export const apiUtils = createAPIUtils(api);

export type APIUtils = typeof apiUtils;

/** Prefer importing `apiUtils` directly; kept for existing call sites. */
export function useApi(): APIUtils {
    return apiUtils;
}

/** Prefer importing `api` from `./api`; kept for existing call sites. */
export function useApiClient(): AppClient {
    return api;
}
