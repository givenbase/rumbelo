import { Module } from '@nestjs/common';

import { CoachModule } from '../../../platform/coach/coach.module';
import { LogModule } from '../../energy/log/log.module';
import { WeekCheckModule as MoneyWeekCheckModule } from '../../money/week-check/week-check.module';
import { GratitudeModule } from '../gratitude/gratitude.module';
import { SoulDashboardController } from './dashboard.controller';
import { SoulDashboardService } from './dashboard.service';

@Module({
    imports: [GratitudeModule, LogModule, MoneyWeekCheckModule, CoachModule],
    controllers: [SoulDashboardController],
    providers: [SoulDashboardService],
    exports: [SoulDashboardService],
})
export class SoulDashboardModule {}
