import { Module } from '@nestjs/common';

import { CoachModule } from './coach/coach.module';
import { HouseholdModule } from './household/household.module';

/**
 * Platform plane — shared by every audience, owned by no single product.
 *
 *   household/  the household itself: settings, members, invitations, onboarding
 *   coach/      advisory that reads across all four products
 *
 * Identity lives in modules/auth; request scoping in common/household.
 * Employee-facing tools (support, admin, billing ops) get a sibling
 * modules/backoffice when the first one is actually built — not before.
 */
@Module({
    imports: [HouseholdModule, CoachModule],
    exports: [HouseholdModule, CoachModule],
})
export class PlatformModule {}
