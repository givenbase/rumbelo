import { Module } from '@nestjs/common';

import { AuthEngineModule } from './engine/engine.module';
import { HouseholdModule } from './household/household.module';
import { UserModule } from './user/user.module';

/**
 * Auth plane — who you are and which household you belong to.
 *
 *   engine/     Better Auth wiring only (config, access control, migrate) — no tables
 *   user/       PERSON: managed/ (Better Auth tables) + account/ (ours)
 *   household/  GROUP:  managed/ (Better Auth tables) + household-settings/ (ours)
 *
 * Better Auth itself is mounted by AppModule via @thallesp/nestjs-better-auth;
 * request-level household scoping lives in common/household.
 */
@Module({
    imports: [AuthEngineModule, UserModule, HouseholdModule],
    exports: [AuthEngineModule, UserModule, HouseholdModule],
})
export class AuthModule {}
