import { Module } from '@nestjs/common';

import { SoulDashboardModule } from './dashboard/dashboard.module';
import { GratitudeModule } from './gratitude/gratitude.module';
import { SoulWeekCheckModule } from './week-check/week-check.module';

/**
 * Product: Ziel. Intention, gratitude and the "why" behind the numbers.
 * Mirrors the Ziel portal in the application navigation.
 */
@Module({
    imports: [GratitudeModule, SoulWeekCheckModule, SoulDashboardModule],
    exports: [GratitudeModule, SoulWeekCheckModule, SoulDashboardModule],
})
export class SoulModule {}
