import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { contract } from '@rumbelo/contracts';
import { LogService } from './log.service.js';

@Controller()
export class LogController {
  constructor(private readonly energyLogs: LogService) {}

  @Implement(contract.energy.logs.list)
  list() {
    return implement(contract.energy.logs.list).handler(() => this.energyLogs.logs());
  }

  @Implement(contract.energy.logs.summary)
  summary() {
    return implement(contract.energy.logs.summary).handler(() => this.energyLogs.summary());
  }

  @Implement(contract.energy.logs.create)
  create() {
    return implement(contract.energy.logs.create).handler(({ input }) =>
      this.energyLogs.create(input),
    );
  }
}
