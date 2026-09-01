import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { currentPeriod } from '../../../common/utils/period.util.js';
import { DashboardService } from './dashboard.service.js';

@Controller()
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Implement(contract.money.dashboard.get)
  get() {
    return implement(contract.money.dashboard.get).handler(({ input }) =>
      this.dashboard.get(input.householdId, input.period ?? currentPeriod()),
    );
  }
}
