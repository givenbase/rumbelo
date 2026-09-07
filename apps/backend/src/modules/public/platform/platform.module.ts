import { Module } from '@nestjs/common';

import { BillingModule } from './billing/billing.module';
import { CoachModule } from './coach/coach.module';

/**
 * Platform Module — cross-product household surfaces (coach, billing).
 */
@Module({
    imports: [CoachModule, BillingModule],
    exports: [CoachModule, BillingModule],
})
export class PlatformModule {}
