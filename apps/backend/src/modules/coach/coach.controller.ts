import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { currentPeriod } from '../../common/utils/period.util.js';
import { CoachService } from './coach.service.js';

@Controller()
export class CoachController {
  constructor(private readonly coach: CoachService) {}

  @Implement(contract.coach.feed)
  feed() {
    return implement(contract.coach.feed).handler(({ input }) =>
      this.coach.feed(input.period ?? currentPeriod()),
    );
  }

  @Implement(contract.coach.dismiss)
  dismiss() {
    return implement(contract.coach.dismiss).handler(async ({ input }) => {
      await this.coach.dismiss(input.id);
      return { ok: true as const };
    });
  }
}
