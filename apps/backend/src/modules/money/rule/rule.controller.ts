import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { RuleService } from './rule.service.js';

@Controller()
export class RuleController {
  constructor(private readonly rules: RuleService) {}

  @Implement(contract.money.rules.list)
  list() {
    return implement(contract.money.rules.list).handler(() => this.rules.list());
  }

  @Implement(contract.money.rules.create)
  create() {
    return implement(contract.money.rules.create).handler(({ input }) =>
      this.rules.create({
        field: input.field,
        matcher: input.matcher,
        value: input.value,
        jarId: input.jarId,
        categoryId: input.categoryId,
        priority: input.priority,
        active: input.active,
      }),
    );
  }

  @Implement(contract.money.rules.update)
  update() {
    return implement(contract.money.rules.update).handler(({ input }) => {
      const { id, ...patch } = input;
      return this.rules.update(id, patch);
    });
  }

  @Implement(contract.money.rules.remove)
  remove() {
    return implement(contract.money.rules.remove).handler(({ input }) =>
      this.rules.remove(input.id),
    );
  }

  @Implement(contract.money.rules.replay)
  replay() {
    return implement(contract.money.rules.replay).handler(() => this.rules.replay());
  }
}
