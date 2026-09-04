import { Module } from '@nestjs/common';

import { AccountModule } from './account/account.module';
import { BetterAuthModule } from './better-auth/better-auth.module';

/**
 * Auth plane — who you are and what we know about you.
 *
 *   account/      Rumbelo-owned account information (profile data we store)
 *   better-auth/  the auth library's domain: config, access control, and
 *                 read-only entities over its tables (user, session, member, …)
 *
 * better-auth itself is mounted by AppModule via @thallesp/nestjs-better-auth;
 * request-level household scoping lives in common/household.
 */
@Module({
    imports: [AccountModule, BetterAuthModule],
    exports: [AccountModule, BetterAuthModule],
})
export class AuthModule {}
