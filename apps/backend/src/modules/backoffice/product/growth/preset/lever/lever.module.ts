import { Module } from '@nestjs/common';

import { WealthStageModule } from '../../catalog/wealth-stage/wealth-stage.module';
import { LeverPreset } from './lever.entity';
import { LeverPresetService } from './lever.service';

@Module({
    imports: [WealthStageModule],
    providers: [LeverPresetService],
    exports: [LeverPresetService],
})
export class LeverPresetModule {}

export { LeverPreset, LeverPresetService };
