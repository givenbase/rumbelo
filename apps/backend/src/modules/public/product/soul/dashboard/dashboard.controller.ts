import { contract } from '@rumtelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../../common/decorators/controller-swagger.decorators';
import { SoulDashboardService } from './dashboard.service';

/** Transport only. Handler order is always CRUD. */
@ControllerSwagger('soul/dashboard', 'public')
export class SoulDashboardController {
    constructor(@Inject(SoulDashboardService) private readonly dashboard: SoulDashboardService) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    @Implement(contract.soul.dashboard.get)
    get() {
        return implement(contract.soul.dashboard.get).handler(() => this.dashboard.get());
    }
}
