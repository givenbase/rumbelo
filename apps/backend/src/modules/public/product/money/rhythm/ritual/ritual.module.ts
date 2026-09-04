import { Module } from '@nestjs/common';

import { RitualController } from './ritual.controller';
import { RitualService } from './ritual.service';

@Module({
    controllers: [RitualController],
    providers: [RitualService],
    exports: [RitualService],
})
export class RitualModule {}
