import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { FixedCostPreset } from './fixed-cost.entity';
import { FixedCostPresetService } from './fixed-cost.service';

@Module({
    imports: [MikroOrmModule.forFeature([FixedCostPreset])],
    providers: [FixedCostPresetService],
    exports: [FixedCostPresetService],
})
export class FixedCostPresetModule {}
