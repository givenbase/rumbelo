import { Module } from '@nestjs/common';

import { RitualModule } from './ritual/ritual.module';
import { TurnModule } from './turn/turn.module';

/** The cadence of the product: the monthly turn and the weekly ritual. */
@Module({
    imports: [TurnModule, RitualModule],
    exports: [TurnModule, RitualModule],
})
export class RhythmModule {}
