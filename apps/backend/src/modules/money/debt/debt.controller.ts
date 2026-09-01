import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { DebtService } from './debt.service.js';
import { PayoffStrategy } from './entities/index.js';

@Controller()
export class DebtController {
    constructor(private readonly debts: DebtService) {}

    @Implement(contract.money.debts.list)
    list() {
        return implement(contract.money.debts.list).handler(() => this.debts.list());
    }

    @Implement(contract.money.debts.plan)
    plan() {
        return implement(contract.money.debts.plan).handler(({ input }) =>
            this.debts.plan(input.strategy as PayoffStrategy)
        );
    }

    @Implement(contract.money.debts.create)
    create() {
        return implement(contract.money.debts.create).handler(({ input }) =>
            this.debts.create({
                name: input.name,
                kind: input.kind,
                balance: input.balance,
                originalBalance: input.originalBalance,
                interestRate: input.interestRate,
                minimumPayment: input.minimumPayment,
                extraPayment: input.extraPayment,
                dueDay: input.dueDay,
                closedOn: input.closedOn,
            })
        );
    }

    @Implement(contract.money.debts.update)
    update() {
        return implement(contract.money.debts.update).handler(({ input }) => {
            const { id, ...patch } = input;
            return this.debts.update(id, patch);
        });
    }

    @Implement(contract.money.debts.remove)
    remove() {
        return implement(contract.money.debts.remove).handler(({ input }) =>
            this.debts.remove(input.id)
        );
    }
}
