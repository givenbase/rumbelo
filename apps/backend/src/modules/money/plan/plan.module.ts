import { Module } from '@nestjs/common';

import { FixedCostModule } from './fixed-cost/fixed-cost.module.js';
import { IncomeModule } from './income/income.module.js';
import { JarModule } from './jar/jar.module.js';

/** The split setup: six jars, income sources, and the fixed costs they must cover. */
@Module({
    imports: [JarModule, IncomeModule, FixedCostModule],
    exports: [JarModule, IncomeModule, FixedCostModule],
})
export class PlanModule {}
