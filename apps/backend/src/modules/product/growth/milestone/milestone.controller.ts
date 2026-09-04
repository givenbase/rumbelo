import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { MilestoneService } from './milestone.service';

/** Transport only. Handler order is always CRUD. */
@Controller()
export class MilestoneController {
    constructor(private readonly milestones: MilestoneService) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** List income milestones for the current household. */
    @Implement(contract.growth.milestones.list)
    list() {
        return implement(contract.growth.milestones.list).handler(() => this.milestones.list());
    }
}
