import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { currentWeek } from '../../../../../common/utils/period.util';
import { RitualService } from './ritual.service';

/** Transport only. Handler order is always CRUD. */
@Controller()
export class RitualController {
    constructor(private readonly rituals: RitualService) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Return (or lazily create) the ritual for a given week. */
    @Implement(contract.money.ritual.current)
    current() {
        return implement(contract.money.ritual.current).handler(({ input }) =>
            this.rituals.current(input.week ?? currentWeek())
        );
    }

    /** Last 26 weeks of rituals, newest first. */
    @Implement(contract.money.ritual.history)
    history() {
        return implement(contract.money.ritual.history).handler(() => this.rituals.history());
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    /** Move a ritual to the next stage (LOOK → REDIRECT → INTEND → DONE). */
    @Implement(contract.money.ritual.advance)
    advance() {
        return implement(contract.money.ritual.advance).handler(({ input }) =>
            this.rituals.advance({
                week: input.week,
                stage: input.stage,
                allocations: input.allocations ?? undefined,
                intention: input.intention ?? undefined,
            })
        );
    }
}
