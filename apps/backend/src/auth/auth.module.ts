import { Global, Module } from '@nestjs/common';

/**
 * Auth module — shell for auth-adjacent providers.
 *
 * better-auth is mounted by AppModule via @thallesp/nestjs-better-auth, which
 * registers its own routes under /api/auth and handles cookies, sessions and
 * organisation plugin state. This module is a sibling, not a replacement.
 *
 * Household scoping is enforced by `HouseholdScopeInterceptor`
 * (common/household), which resolves the session and membership per request.
 *
 * If a NestJS guard needs to verify a session server-side use:
 *   import { createAuth } from './auth.config.js';
 *   const auth = createAuth(env);
 *   const session = await auth.api.getSession({ headers: request.headers });
 */
@Global()
@Module({})
export class AuthModule {}
