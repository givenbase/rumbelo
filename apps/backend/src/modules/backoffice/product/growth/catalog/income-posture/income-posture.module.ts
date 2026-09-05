import { Module } from '@nestjs/common';

import { IncomePostureService } from './income-posture.service';

@Module({
    providers: [IncomePostureService],
    exports: [IncomePostureService],
})
export class IncomePostureModule {}

export { IncomePosture } from './income-posture.entity';
export { IncomePostureService };
