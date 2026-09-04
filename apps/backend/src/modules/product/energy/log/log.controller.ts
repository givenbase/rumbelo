import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { LogService } from './log.service';

/** Transport only. Handler order is always CRUD. */
@Controller()
export class LogController {
    constructor(private readonly energyLogs: LogService) {}

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    /** Record or upsert an energy log entry for the given day. */
    @Implement(contract.energy.logs.create)
    create() {
        return implement(contract.energy.logs.create).handler(({ input }) =>
            this.energyLogs.create(input)
        );
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** List recent energy logs for the current household. */
    @Implement(contract.energy.logs.list)
    list() {
        return implement(contract.energy.logs.list).handler(() => this.energyLogs.logs());
    }

    /** Rolling averages and trend per metric. */
    @Implement(contract.energy.logs.summary)
    summary() {
        return implement(contract.energy.logs.summary).handler(() => this.energyLogs.summary());
    }
}
