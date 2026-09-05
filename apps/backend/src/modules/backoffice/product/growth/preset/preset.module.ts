import { Module } from '@nestjs/common';

import { LeverPresetModule } from './lever';

/** Growth presets — lever suggestions households may adopt. */
@Module({
    imports: [LeverPresetModule],
    exports: [LeverPresetModule],
})
export class GrowthPresetModule {}
