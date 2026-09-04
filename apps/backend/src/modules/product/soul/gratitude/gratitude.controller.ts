import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { currentWeek } from '../../../../common/utils/period.util';
import { GratitudeService } from './gratitude.service';

/** Transport only. Handler order is always CRUD. */
@Controller()
export class GratitudeController {
    constructor(private readonly gratitude: GratitudeService) {}

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    /** Record a new gratitude entry for the current week. */
    @Implement(contract.soul.gratitude.create)
    add() {
        return implement(contract.soul.gratitude.create).handler(({ input }) =>
            this.gratitude.create(input)
        );
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** List gratitude entries for the given week. */
    @Implement(contract.soul.gratitude.list)
    list() {
        return implement(contract.soul.gratitude.list).handler(({ input }) =>
            this.gratitude.forWeek(input.week ?? currentWeek())
        );
    }
}
