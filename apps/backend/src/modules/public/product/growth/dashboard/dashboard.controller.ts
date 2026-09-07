import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../../common/decorators/controller-swagger.decorators';
import { GrowthDashboardService } from './dashboard.service';

/** Transport only. Handler order is always CRUD. */
@ControllerSwagger('growth/dashboard', 'public')
export class GrowthDashboardController {
    constructor(
        @Inject(GrowthDashboardService) private readonly dashboard: GrowthDashboardService
    ) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    @Implement(contract.growth.dashboard.get)
    get() {
        return implement(contract.growth.dashboard.get).handler(() => this.dashboard.get());
    }
}
