import { Module } from '@nestjs/common';

import { EnergyModule } from './energy/energy.module';
import { GrowthModule } from './growth/growth.module';
import { MoneyModule } from './money/money.module';
import { SoulModule } from './soul/soul.module';

/**
 * Product plane — the four household-facing portals.
 *
 *   money/   Geld
 *   growth/  Groei
 *   energy/  Energie
 *   soul/    Ziel
 *
 * Lives under modules/public (Postgres `public` schema).
 */
@Module({
    imports: [MoneyModule, GrowthModule, EnergyModule, SoulModule],
    exports: [MoneyModule, GrowthModule, EnergyModule, SoulModule],
})
export class ProductModule {}
