import { Module } from '@nestjs/common';

import { SoulWeekCheckController } from './week-check.controller';
import { SoulWeekCheckService } from './week-check.service';

@Module({
    controllers: [SoulWeekCheckController],
    providers: [SoulWeekCheckService],
    exports: [SoulWeekCheckService],
})
export class SoulWeekCheckModule {}
