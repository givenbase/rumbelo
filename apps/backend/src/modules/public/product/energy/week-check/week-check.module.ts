import { Module } from '@nestjs/common';

import { EnergyWeekCheckController } from './week-check.controller';
import { EnergyWeekCheckService } from './week-check.service';

@Module({
    controllers: [EnergyWeekCheckController],
    providers: [EnergyWeekCheckService],
    exports: [EnergyWeekCheckService],
})
export class EnergyWeekCheckModule {}
