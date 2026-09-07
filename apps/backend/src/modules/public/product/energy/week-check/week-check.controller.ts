import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../../common/decorators/controller-swagger.decorators';
import { currentWeek } from '../../../../../common/utils/period.util';
import { EnergyWeekCheckService } from './week-check.service';

/** Transport only. Handler order is always CRUD. */
@ControllerSwagger('energy/week-check', 'public')
export class EnergyWeekCheckController {
    constructor(
        @Inject(EnergyWeekCheckService) private readonly weekChecks: EnergyWeekCheckService
    ) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Return (or lazily create) the week check for a given week. */
    @Implement(contract.energy.weekCheck.current)
    current() {
        return implement(contract.energy.weekCheck.current).handler(({ input }) =>
            this.weekChecks.current(input.week ?? currentWeek())
        );
    }

    /** Last 26 weeks of week checks, newest first. */
    @Implement(contract.energy.weekCheck.history)
    history() {
        return implement(contract.energy.weekCheck.history).handler(() =>
            this.weekChecks.history()
        );
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    /** Mark the week check complete (shell — product steps land later). */
    @Implement(contract.energy.weekCheck.complete)
    complete() {
        return implement(contract.energy.weekCheck.complete).handler(({ input }) =>
            this.weekChecks.complete(input.week)
        );
    }
}
