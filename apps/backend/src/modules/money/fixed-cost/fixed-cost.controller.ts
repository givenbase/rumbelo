import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { contract } from '@rumbelo/contracts';
import { FixedCostService } from './fixed-cost.service.js';

@Controller()
export class FixedCostController {
  constructor(private readonly fixedCosts: FixedCostService) {}

  @Implement(contract.money.fixedCosts.list)
  list() {
    return implement(contract.money.fixedCosts.list).handler(({ input }) =>
      this.fixedCosts.list(input.direction),
    );
  }

  @Implement(contract.money.fixedCosts.byJar)
  byJar() {
    return implement(contract.money.fixedCosts.byJar).handler(() => this.fixedCosts.byJar());
  }

  @Implement(contract.money.fixedCosts.create)
  create() {
    return implement(contract.money.fixedCosts.create).handler(({ input }) =>
      this.fixedCosts.create({
        jarId: input.jarId,
        categoryId: input.categoryId,
        name: input.name,
        amount: input.amount,
        cadence: input.cadence,
        dueDay: input.dueDay,
        direction: input.direction,
        active: input.active,
        endsOn: input.endsOn,
        note: input.note,
      }),
    );
  }

  @Implement(contract.money.fixedCosts.update)
  update() {
    return implement(contract.money.fixedCosts.update).handler(({ input }) => {
      const { id, ...patch } = input;
      return this.fixedCosts.update(id, patch);
    });
  }

  @Implement(contract.money.fixedCosts.remove)
  remove() {
    return implement(contract.money.fixedCosts.remove).handler(({ input }) =>
      this.fixedCosts.remove(input.id),
    );
  }
}
