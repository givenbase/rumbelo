import { Module } from '@nestjs/common';

import { GratitudeModule } from './gratitude/gratitude.module.js';

/**
 * Product: Ziel. Intention, gratitude and the "why" behind the numbers.
 * Mirrors the Ziel portal in the application navigation.
 */
@Module({
    imports: [GratitudeModule],
    exports: [GratitudeModule],
})
export class SoulModule {}
