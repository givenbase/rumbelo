import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../../common/decorators/controller-swagger.decorators';
import { LogService } from './log.service';

/** Transport only. Handler order is always CRUD. */
@ControllerSwagger('energy/logs', 'public')
export class LogController {
    constructor(@Inject(LogService) private readonly energyLogs: LogService) {}

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
