import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../../common/decorators/controller-swagger.decorators';
import { currentPeriod } from '../../../../../common/utils/period.util';
import { DashboardService } from './dashboard.service';

/** Transport only. Handler order is always CRUD. */
@ControllerSwagger('money/dashboard', 'public')
export class DashboardController {
    constructor(@Inject(DashboardService) private readonly dashboard: DashboardService) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Assemble the full dashboard for a household and period. */
    @Implement(contract.money.dashboard.get)
    get() {
        return implement(contract.money.dashboard.get).handler(({ input }) =>
            this.dashboard.get(input.householdId, input.period ?? currentPeriod())
        );
    }
}
