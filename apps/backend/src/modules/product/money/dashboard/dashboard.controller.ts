import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { currentPeriod } from '../../../../common/utils/period.util';
import { DashboardService } from './dashboard.service';

/** Transport only. Handler order is always CRUD. */
@Controller()
export class DashboardController {
    constructor(private readonly dashboard: DashboardService) {}

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
