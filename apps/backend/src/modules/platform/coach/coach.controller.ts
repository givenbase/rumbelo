import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { currentPeriod } from '../../../common/utils/period.util';
import { CoachService } from './coach.service';

/** Transport only. Handler order is always CRUD. */
@Controller()
export class CoachController {
    constructor(private readonly coach: CoachService) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Return active coach messages for the given period. */
    @Implement(contract.coach.feed)
    feed() {
        return implement(contract.coach.feed).handler(({ input }) =>
            this.coach.feed(input.period ?? currentPeriod())
        );
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    /** Mark a coach message as dismissed. */
    @Implement(contract.coach.dismiss)
    dismiss() {
        return implement(contract.coach.dismiss).handler(async ({ input }) => {
            await this.coach.dismiss(input.id);
            return { ok: true as const };
        });
    }
}
