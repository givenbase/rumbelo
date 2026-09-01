import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { GoalService } from './goal.service.js';

@Controller()
export class GoalController {
    constructor(private readonly goals: GoalService) {}

    @Implement(contract.money.goals.list)
    list() {
        return implement(contract.money.goals.list).handler(() => this.goals.list());
    }

    @Implement(contract.money.goals.projections)
    projections() {
        return implement(contract.money.goals.projections).handler(() => this.goals.projections());
    }

    @Implement(contract.money.goals.create)
    create() {
        return implement(contract.money.goals.create).handler(({ input }) =>
            this.goals.create({
                jarId: input.jarId,
                name: input.name,
                icon: input.icon,
                target: input.target,
                monthlyContribution: input.monthlyContribution,
                targetDate: input.targetDate,
                status: input.status,
                why: input.why,
            })
        );
    }

    @Implement(contract.money.goals.update)
    update() {
        return implement(contract.money.goals.update).handler(({ input }) => {
            const { id, ...patch } = input;
            return this.goals.update(id, patch);
        });
    }

    @Implement(contract.money.goals.remove)
    remove() {
        return implement(contract.money.goals.remove).handler(({ input }) =>
            this.goals.remove(input.id)
        );
    }
}
