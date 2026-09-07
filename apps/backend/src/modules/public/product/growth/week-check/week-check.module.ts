import { Module } from '@nestjs/common';

import { GrowthWeekCheckController } from './week-check.controller';
import { GrowthWeekCheckService } from './week-check.service';

@Module({
    controllers: [GrowthWeekCheckController],
    providers: [GrowthWeekCheckService],
    exports: [GrowthWeekCheckService],
})
export class GrowthWeekCheckModule {}
