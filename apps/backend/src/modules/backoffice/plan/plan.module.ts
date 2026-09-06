import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Capability } from './capability.entity';
import { Plan } from './plan.entity';
import { PlanCapability } from './plan-capability.entity';
import { PlanService } from './plan.service';

/**
 * Plan Module
 *
 * Backoffice-owned product tier catalog + capability grant graph.
 */
@Module({
    imports: [MikroOrmModule.forFeature([Plan, Capability, PlanCapability])],
    providers: [PlanService],
    exports: [PlanService],
})
export class PlanModule {}
