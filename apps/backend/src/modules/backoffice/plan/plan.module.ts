import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CapabilityModule } from './capability';
import { PlanFeatureModule } from './feature';
import { PlanController } from './plan.controller';
import { Plan } from './plan.entity';
import { PlanCapabilityModule } from './plan-capability';
import { PlanProductModule } from './product';
import { PlanService } from './plan.service';

/**
 * Plan Module — parent: Plan entity + catalog children (product / feature / capability).
 */
@Module({
    imports: [
        MikroOrmModule.forFeature([Plan]),
        PlanProductModule,
        PlanFeatureModule,
        CapabilityModule,
        PlanCapabilityModule,
    ],
    controllers: [PlanController],
    providers: [PlanService],
    exports: [
        PlanService,
        PlanProductModule,
        PlanFeatureModule,
        CapabilityModule,
        PlanCapabilityModule,
    ],
})
export class PlanModule {}
