import { Module } from '@nestjs/common';

import { WeekCheckController } from './week-check.controller';
import { WeekCheckService } from './week-check.service';

@Module({
    controllers: [WeekCheckController],
    providers: [WeekCheckService],
    exports: [WeekCheckService],
})
export class WeekCheckModule {}
