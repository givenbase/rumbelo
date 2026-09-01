import { Global, Module } from '@nestjs/common';

/**
 * Auth module — shell for auth-adjacent providers.
 *
 * better-auth is mounted by AppModule via @thallesp/nestjs-better-auth, which
 * registers its own routes under /api/auth and handles cookies, sessions and
 * organisation plugin state. This module is a sibling, not a replacement.
 *
 * Re: `createAuthMiddleware` (Sprint F / Phase 4 check):
 *   `createAuthMiddleware` is a better-auth hook factory for *client*-side
 *   request lifecycle hooks — it does NOT apply to NestJS middleware. On the
 *   backend, auth enforcement uses the `@thallesp/nestjs-better-auth` guard
 *   (already active) plus the `TenantMiddleware` for scoped-repository context.
 *
 *   If a NestJS guard needs to verify a session server-side use:
 *     import { createAuth } from './auth.config.js';
 *     const auth = createAuth(env);
 *     const session = await auth.api.getSession({ headers: request.headers });
 *
 *   TODO: Wire session guard once the first route needs server-side auth check.
 */
@Global()
@Module({})
export class AuthModule {}
