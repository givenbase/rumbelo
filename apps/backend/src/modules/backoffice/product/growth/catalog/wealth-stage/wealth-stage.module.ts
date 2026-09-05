import { Module } from '@nestjs/common';

import { WealthStageService } from './wealth-stage.service';

@Module({
    providers: [WealthStageService],
    exports: [WealthStageService],
})
export class WealthStageModule {}

export { WealthStage } from './wealth-stage.entity';
export { WealthStageService };
