import { Module } from '@nestjs/common';

import { CoachModule } from './coach/coach.module';
import { HouseholdModule } from './household/household.module';

/**
 * Platform plane — shared by every product, owned by no single portal.
 *
 *   household/  settings, members, invitations, onboarding
 *   coach/      advisory that reads across all four products
 *
 * Lives under modules/public (Postgres `public` schema).
 */
@Module({
    imports: [HouseholdModule, CoachModule],
    exports: [HouseholdModule, CoachModule],
})
export class PlatformModule {}
