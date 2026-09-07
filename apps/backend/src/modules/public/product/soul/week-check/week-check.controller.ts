import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../../common/decorators/controller-swagger.decorators';
import { currentWeek } from '../../../../../common/utils/period.util';
import { SoulWeekCheckService } from './week-check.service';

/** Transport only. Handler order is always CRUD. */
@ControllerSwagger('soul/week-check', 'public')
export class SoulWeekCheckController {
    constructor(@Inject(SoulWeekCheckService) private readonly weekChecks: SoulWeekCheckService) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Return (or lazily create) the week check for a given week. */
    @Implement(contract.soul.weekCheck.current)
    current() {
        return implement(contract.soul.weekCheck.current).handler(({ input }) =>
            this.weekChecks.current(input.week ?? currentWeek())
        );
    }

    /** Last 26 weeks of week checks, newest first. */
    @Implement(contract.soul.weekCheck.history)
    history() {
        return implement(contract.soul.weekCheck.history).handler(() => this.weekChecks.history());
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    /** Mark the week check complete (shell — product steps land later). */
    @Implement(contract.soul.weekCheck.complete)
    complete() {
        return implement(contract.soul.weekCheck.complete).handler(({ input }) =>
            this.weekChecks.complete(input.week)
        );
    }
}
