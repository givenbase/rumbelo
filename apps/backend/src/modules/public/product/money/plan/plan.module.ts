import { Module } from '@nestjs/common';

import { CatalogModule } from './catalog/catalog.module';
import { FixedCostModule } from './fixed-cost/fixed-cost.module';
import { IncomeModule } from './income/income.module';
import { JarModule } from './jar/jar.module';

/** The split setup: six jars, income sources, fixed costs, and reference catalogs. */
@Module({
    imports: [JarModule, IncomeModule, FixedCostModule, CatalogModule],
    exports: [JarModule, IncomeModule, FixedCostModule, CatalogModule],
})
export class PlanModule {}
