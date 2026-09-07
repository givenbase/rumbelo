import { Module } from '@nestjs/common';

import { CoachModule } from '../../../platform/coach/coach.module';
import { JarModule } from '../../money/plan/jar/jar.module';
import { GoalModule } from '../../money/targets/goal/goal.module';
import { GrowthDashboardController } from './dashboard.controller';
import { GrowthDashboardService } from './dashboard.service';

@Module({
    imports: [GoalModule, JarModule, CoachModule],
    controllers: [GrowthDashboardController],
    providers: [GrowthDashboardService],
    exports: [GrowthDashboardService],
})
export class GrowthDashboardModule {}
