import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { DebtPreset } from './debt.entity';
import { DebtPresetService } from './debt.service';

@Module({
    imports: [MikroOrmModule.forFeature([DebtPreset])],
    providers: [DebtPresetService],
    exports: [DebtPresetService],
})
export class DebtPresetModule {}
