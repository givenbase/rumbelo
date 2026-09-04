import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Plan } from './plan.entity';
import { PlanService } from './plan.service';

/**
 * Plan Module
 *
 * Backoffice-owned product tier catalog (Grip / Engine / Compound).
 */
@Module({
    imports: [MikroOrmModule.forFeature([Plan])],
    providers: [PlanService],
    exports: [PlanService],
})
export class PlanModule {}
