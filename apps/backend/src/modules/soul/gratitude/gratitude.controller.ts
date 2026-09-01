import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { contract } from '@rumbelo/contracts';
import { currentWeek } from '../../../common/utils/period.util.js';
import { GratitudeService } from './gratitude.service.js';

@Controller()
export class GratitudeController {
  constructor(private readonly gratitude: GratitudeService) {}

  @Implement(contract.soul.gratitude.list)
  list() {
    return implement(contract.soul.gratitude.list).handler(({ input }) =>
      this.gratitude.forWeek(input.week ?? currentWeek()),
    );
  }

  @Implement(contract.soul.gratitude.create)
  add() {
    return implement(contract.soul.gratitude.create).handler(({ input }) =>
      this.gratitude.create(input),
    );
  }
}
