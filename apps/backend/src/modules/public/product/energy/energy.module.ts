import { Module } from '@nestjs/common';

import { LogModule } from './log/log.module';
import { EnergyWeekCheckModule } from './week-check/week-check.module';

/**
 * Product: Energie. Sleep, training, food and rest — tracked because the product
 * claims they are the floor under financial decisions, not as lifestyle extras.
 * Mirrors the Energie portal in the application navigation.
 */
@Module({
    imports: [LogModule, EnergyWeekCheckModule],
    exports: [LogModule, EnergyWeekCheckModule],
})
export class EnergyModule {}
