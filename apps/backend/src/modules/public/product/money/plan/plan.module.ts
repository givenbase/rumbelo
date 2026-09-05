import { Module } from '@nestjs/common';

import { MoneyCatalogsModule } from './catalogs/catalogs.module';
import { FixedCostModule } from './fixed-cost/fixed-cost.module';
import { IncomeModule } from './income/income.module';
import { JarModule } from './jar/jar.module';

/** The split setup: six jars, income sources, fixed costs, and company catalogs. */
@Module({
    imports: [JarModule, IncomeModule, FixedCostModule, MoneyCatalogsModule],
    exports: [JarModule, IncomeModule, FixedCostModule, MoneyCatalogsModule],
})
export class PlanModule {}
