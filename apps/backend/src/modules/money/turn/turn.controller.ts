import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { contract } from '@rumbelo/contracts';
import { currentPeriod } from '../../../common/utils/period.util.js';
import { TurnService } from './turn.service.js';

@Controller()
export class TurnController {
  constructor(private readonly turns: TurnService) {}

  @Implement(contract.money.turn.current)
  current() {
    return implement(contract.money.turn.current).handler(({ input }) =>
      this.turns.current(input.period ?? currentPeriod()),
    );
  }

  @Implement(contract.money.turn.levels)
  levels() { return implement(contract.money.turn.levels).handler(async () => this.turns.levels()); }

  @Implement(contract.money.turn.recap)
  recap() {
    return implement(contract.money.turn.recap).handler(({ input }) =>
      this.turns.recap(input.period),
    );
  }

  @Implement(contract.money.turn.close)
  close() {
    return implement(contract.money.turn.close).handler(({ input }) =>
      this.turns.close(input.period),
    );
  }
}
