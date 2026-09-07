import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../../common/decorators/controller-swagger.decorators';
import { EnergyDashboardService } from './dashboard.service';

/** Transport only. Handler order is always CRUD. */
@ControllerSwagger('energy/dashboard', 'public')
export class EnergyDashboardController {
    constructor(
        @Inject(EnergyDashboardService) private readonly dashboard: EnergyDashboardService
    ) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    @Implement(contract.energy.dashboard.get)
    get() {
        return implement(contract.energy.dashboard.get).handler(() => this.dashboard.get());
    }
}
