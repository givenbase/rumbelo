import { Module } from '@nestjs/common';

import { GrowthCatalogsModule } from './catalogs/catalogs.module';
import { GrowthDashboardModule } from './dashboard/dashboard.module';
import { LeverModule } from './lever/lever.module';
import { MilestoneModule } from './milestone/milestone.module';
import { GrowthWeekCheckModule } from './week-check/week-check.module';

/**
 * Product: Groei. Everything about raising earning power rather than dividing
 * what already arrived. Mirrors the Groei portal in the application navigation.
 */
@Module({
    imports: [
        LeverModule,
        MilestoneModule,
        GrowthCatalogsModule,
        GrowthWeekCheckModule,
        GrowthDashboardModule,
    ],
    exports: [
        LeverModule,
        MilestoneModule,
        GrowthCatalogsModule,
        GrowthWeekCheckModule,
        GrowthDashboardModule,
    ],
})
export class GrowthModule {}
