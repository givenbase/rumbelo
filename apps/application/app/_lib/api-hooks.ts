/**
 * TanStack Query helpers for the app API client.
 *
 * Prefer importing `apiQuery` (query keys / options) and `api` from `./api`
 * (mutations) as module singletons — do not wrap them in hooks.
 *
 * Import `createAPIUtils` only; let TypeScript infer the type here.
 * Do not re-export that return type from `@rumbelo/contracts/react` (TS7056).
 */

'use client';

import { createAPIUtils } from '@rumbelo/contracts/react';

import { api } from './api';

export const apiQuery = createAPIUtils(api);

export type ApiQuery = typeof apiQuery;
