import { Module } from '@nestjs/common';

/**
 * Auth engine — Better Auth wiring, no tables.
 *
 * Better Auth is mounted by AppModule via @thallesp/nestjs-better-auth, which
 * registers its routes under /api/auth and handles cookies, sessions and
 * organization (household) plugin state. This folder groups its config only:
 *
 *   auth.config.ts            createAuth(env) — plugins, ids, cookies, e-mail hooks
 *   access-control.config.ts  household roles / permissions
 *   auth.cli.config.ts        entry for `@better-auth/cli`
 *   auth.migrate.ts           `pnpm auth:migrate`
 *   auth-url.util.ts          origin rewriting for links Better Auth builds
 *   sign-up-profile.store.ts  stash Account fields across Better Auth sign-up hooks
 *   sign-up-account.util.ts   insert `auth.account` after Better Auth creates the user
 *
 * Tables Better Auth writes are mirrored as read-only entities under
 * `../user/managed/` (person) and `../household/managed/` (group).
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
export class AuthEngineModule {}
