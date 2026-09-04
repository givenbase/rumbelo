import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../../../common/decorators/controller-swagger.decorators';
import { PayoffStrategy } from './debt.entity';
import { DebtService } from './debt.service';

/** Transport only. Handler order is always CRUD. */
@ControllerSwagger('money/debts', 'public')
export class DebtController {
    constructor(@Inject(DebtService) private readonly debts: DebtService) {}

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    /** Register a new debt for tracking. */
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

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** List all open debts for the current household. */
    @Implement(contract.money.debts.list)
    list() {
        return implement(contract.money.debts.list).handler(() => this.debts.list());
    }

    /** Return a payoff plan for the chosen strategy. */
    @Implement(contract.money.debts.plan)
    plan() {
        return implement(contract.money.debts.plan).handler(({ input }) =>
            this.debts.plan(input.strategy as PayoffStrategy)
        );
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    /** Patch mutable fields on a debt record. */
    @Implement(contract.money.debts.update)
    update() {
        return implement(contract.money.debts.update).handler(({ input }) => {
            const { id, ...patch } = input;
            return this.debts.update(id, patch);
        });
    }

    // ====================================================================
    // ? DELETE Operations
    // ====================================================================

    /** Remove a debt record. */
    @Implement(contract.money.debts.remove)
    remove() {
        return implement(contract.money.debts.remove).handler(({ input }) =>
            this.debts.remove(input.id)
        );
    }
}
