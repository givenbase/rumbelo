import { Module } from '@nestjs/common';

import { LogModule } from './log/log.module.js';

/**
 * Product: Energie. Sleep, training, food and rest — tracked because the product
 * claims they are the floor under financial decisions, not as lifestyle extras.
 * Mirrors the Energie portal in the application navigation.
 */
@Module({
    imports: [LogModule],
    exports: [LogModule],
})
export class EnergyModule {}
