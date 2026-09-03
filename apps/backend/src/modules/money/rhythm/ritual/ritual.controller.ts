import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { currentWeek } from '../../../../common/utils/period.util.js';
import { RitualService } from './ritual.service.js';

@Controller()
export class RitualController {
    constructor(private readonly rituals: RitualService) {}

    @Implement(contract.money.ritual.current)
    current() {
        return implement(contract.money.ritual.current).handler(({ input }) =>
            this.rituals.current(input.week ?? currentWeek())
        );
    }

    @Implement(contract.money.ritual.history)
    history() {
        return implement(contract.money.ritual.history).handler(() => this.rituals.history());
    }

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
