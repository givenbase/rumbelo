import { Module } from '@nestjs/common';

import {
    IncomePostureModule,
    LeverPresetModule,
    WealthStageModule,
} from '../../../../backoffice/product';
import { GrowthCatalogsController } from './catalogs.controller';

/** Public API surface for growth company catalogs (presets + taxonomies). */
@Module({
    imports: [LeverPresetModule, IncomePostureModule, WealthStageModule],
    controllers: [GrowthCatalogsController],
})
export class GrowthCatalogsModule {}
