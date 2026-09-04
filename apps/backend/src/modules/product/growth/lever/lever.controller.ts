import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { LeverService } from './lever.service';

/** Transport only. Handler order is always CRUD. */
@Controller()
export class LeverController {
    constructor(private readonly levers: LeverService) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** List income levers for the current household. */
    @Implement(contract.growth.levers.list)
    list() {
        return implement(contract.growth.levers.list).handler(() => this.levers.list());
    }
}
