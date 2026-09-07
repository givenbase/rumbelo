import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../common/decorators/controller-swagger.decorators';
import { PlanService } from './plan.service';

/** Read-only plan catalog for Settings / comparison. */
@ControllerSwagger('plans', 'public')
export class PlanController {
    constructor(@Inject(PlanService) private readonly plans: PlanService) {}

    @Implement(contract.plans.list)
    list() {
        return implement(contract.plans.list).handler(async () => {
            const rows = await this.plans.listActive();
            return rows.map(plan => ({
                key: plan.key,
                name: plan.name,
                priceMonthly: plan.priceMonthly,
                capabilities: plan.capabilities,
                sortOrder: plan.sortOrder,
                isActive: plan.isActive,
            }));
        });
    }
}
