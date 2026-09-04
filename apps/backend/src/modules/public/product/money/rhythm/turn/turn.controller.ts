import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../../../common/decorators/controller-swagger.decorators';
import { currentPeriod } from '../../../../../../common/utils/period.util';
import { TurnService } from './turn.service';

/** Transport only. Handler order is always CRUD. */
@ControllerSwagger('money/turn', 'public')
export class TurnController {
    constructor(@Inject(TurnService) private readonly turns: TurnService) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Return (or build) the current period's turn state and events. */
    @Implement(contract.money.turn.current)
    current() {
        return implement(contract.money.turn.current).handler(({ input }) =>
            this.turns.current(input.period ?? currentPeriod())
        );
    }

    /** Static level definitions with thresholds and unlocks. */
    @Implement(contract.money.turn.levels)
    levels() {
        return implement(contract.money.turn.levels).handler(async () => this.turns.levels());
    }

    /** Period recap: income, spent, leftOver, score, best/worst jar. */
    @Implement(contract.money.turn.recap)
    recap() {
        return implement(contract.money.turn.recap).handler(({ input }) =>
            this.turns.recap(input.period)
        );
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    /** Finalise a period turn; idempotent if already closed. */
    @Implement(contract.money.turn.close)
    close() {
        return implement(contract.money.turn.close).handler(({ input }) =>
            this.turns.close(input.period)
        );
    }
}
