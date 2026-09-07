import { Module } from '@nestjs/common';

import { CoachModule } from '../../../platform/coach/coach.module';
import { LogModule } from '../log/log.module';
import { EnergyWeekCheckModule } from '../week-check/week-check.module';
import { EnergyDashboardController } from './dashboard.controller';
import { EnergyDashboardService } from './dashboard.service';

@Module({
    imports: [LogModule, EnergyWeekCheckModule, CoachModule],
    controllers: [EnergyDashboardController],
    providers: [EnergyDashboardService],
    exports: [EnergyDashboardService],
})
export class EnergyDashboardModule {}
