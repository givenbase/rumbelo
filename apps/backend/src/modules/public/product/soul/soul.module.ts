import { Module } from '@nestjs/common';

import { GratitudeModule } from './gratitude/gratitude.module';
import { SoulWeekCheckModule } from './week-check/week-check.module';

/**
 * Product: Ziel. Intention, gratitude and the "why" behind the numbers.
 * Mirrors the Ziel portal in the application navigation.
 */
@Module({
    imports: [GratitudeModule, SoulWeekCheckModule],
    exports: [GratitudeModule, SoulWeekCheckModule],
})
export class SoulModule {}
