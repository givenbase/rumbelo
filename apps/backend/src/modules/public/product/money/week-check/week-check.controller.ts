import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../../common/decorators/controller-swagger.decorators';
import { currentWeek } from '../../../../../common/utils/period.util';
import { WeekCheckService } from './week-check.service';

/** Transport only. Handler order is always CRUD. */
@ControllerSwagger('money/week-check', 'public')
export class WeekCheckController {
    constructor(@Inject(WeekCheckService) private readonly weekChecks: WeekCheckService) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Return (or lazily create) the week check for a given week. */
    @Implement(contract.money.weekCheck.current)
    current() {
        return implement(contract.money.weekCheck.current).handler(({ input }) =>
            this.weekChecks.current(input.week ?? currentWeek())
        );
    }

    /** Last 26 weeks of week checks, newest first. */
    @Implement(contract.money.weekCheck.history)
    history() {
        return implement(contract.money.weekCheck.history).handler(() => this.weekChecks.history());
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    /** Move a week check to the next stage (LOOK → REDIRECT → INTEND → DONE). */
    @Implement(contract.money.weekCheck.advance)
    advance() {
        return implement(contract.money.weekCheck.advance).handler(({ input }) =>
            this.weekChecks.advance({
                week: input.week,
                stage: input.stage,
                allocations: input.allocations ?? undefined,
                intention: input.intention ?? undefined,
            })
        );
    }
}
