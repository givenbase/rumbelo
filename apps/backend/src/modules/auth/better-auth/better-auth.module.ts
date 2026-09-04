import { Module } from '@nestjs/common';

/**
 * better-auth module — shell for the auth library's domain.
 *
 * better-auth is mounted by AppModule via @thallesp/nestjs-better-auth, which
 * registers its routes under /api/auth and handles cookies, sessions and
 * organization plugin state. This module groups its config (auth.config,
 * access-control.config) and the read-only entities over its tables.
 *
 * Household scoping is enforced by `HouseholdScopeInterceptor`
 * (common/household), which resolves the session and membership per request.
 *
 * If a NestJS guard needs to verify a session server-side use:
 *   import { createAuth } from './auth.config';
 *   const auth = createAuth(env);
 *   const session = await auth.api.getSession({ headers: request.headers });
 */
@Module({})
export class BetterAuthModule {}
