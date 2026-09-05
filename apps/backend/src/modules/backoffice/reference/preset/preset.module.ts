import { Module } from '@nestjs/common';

import { DebtPresetModule } from './debt';
import { FixedCostPresetModule } from './fixed-cost';
import { GoalPresetModule } from './goal';
import { IncomeSourcePresetModule } from './income';
import { MerchantPresetModule } from './merchant';

/** Backoffice suggestion catalogs for create forms. */
@Module({
    imports: [
        FixedCostPresetModule,
        DebtPresetModule,
        IncomeSourcePresetModule,
        GoalPresetModule,
        MerchantPresetModule,
    ],
    exports: [
        FixedCostPresetModule,
        DebtPresetModule,
        IncomeSourcePresetModule,
        GoalPresetModule,
        MerchantPresetModule,
    ],
})
export class PresetModule {}
