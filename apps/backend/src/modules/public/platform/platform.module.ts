import { Module } from '@nestjs/common';

import { CoachModule } from './coach/coach.module';

/**
 * Platform plane — shared by every product, owned by no single portal.
 *
 *   coach/  advisory that reads across all four products
 *
 * Household onboarding, members and board settings moved to `modules/auth/household`
 * (they are the GROUP half of identity, next to Better Auth's managed tables).
 *
 * Lives under modules/public (Postgres `public` schema).
 */
@Module({
    imports: [CoachModule],
    exports: [CoachModule],
})
export class PlatformModule {}
