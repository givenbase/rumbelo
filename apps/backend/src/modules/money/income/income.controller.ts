import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { IncomeService } from './income.service.js';

@Controller()
export class IncomeController {
  constructor(private readonly income: IncomeService) {}

  @Implement(contract.money.income.list)
  list() {
    return implement(contract.money.income.list).handler(() => this.income.list());
  }

  @Implement(contract.money.income.create)
  create() {
    return implement(contract.money.income.create).handler(({ input }) =>
      this.income.create({
        name: input.name,
        kind: input.kind,
        amount: input.amount,
        cadence: input.cadence,
        expectedDay: input.expectedDay,
        active: input.active,
        startedOn: input.startedOn,
      }),
    );
  }

  @Implement(contract.money.income.update)
  update() {
    return implement(contract.money.income.update).handler(({ input }) => {
      const { id, ...patch } = input;
      return this.income.update(id, patch);
    });
  }

  @Implement(contract.money.income.remove)
  remove() {
    return implement(contract.money.income.remove).handler(({ input }) =>
      this.income.remove(input.id),
    );
  }

  @Implement(contract.money.income.applySplit)
  applySplit() {
    return implement(contract.money.income.applySplit).handler(({ input }) =>
      this.income.applySplit(input.amount),
    );
  }
}
