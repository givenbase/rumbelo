import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
    constructor(private readonly transactions: TransactionService) {}

    @Implement(contract.money.transactions.inbox)
    inbox() {
        return implement(contract.money.transactions.inbox).handler(() =>
            this.transactions.inbox()
        );
    }

    @Implement(contract.money.transactions.list)
    list() {
        return implement(contract.money.transactions.list).handler(({ input }) =>
            this.transactions.list({ status: input.status, jarId: input.jarId, limit: input.limit })
        );
    }

    @Implement(contract.money.transactions.create)
    create() {
        return implement(contract.money.transactions.create).handler(({ input }) =>
            this.transactions.create(input)
        );
    }

    @Implement(contract.money.transactions.sort)
    sort() {
        return implement(contract.money.transactions.sort).handler(({ input }) =>
            this.transactions.sort(
                input.transactionId,
                input.jarId,
                input.categoryId,
                input.createRule
            )
        );
    }

    @Implement(contract.money.transactions.bulkSort)
    bulkSort() {
        return implement(contract.money.transactions.bulkSort).handler(({ input }) =>
            this.transactions.bulkSort(input.transactionIds, input.jarId, input.categoryId)
        );
    }

    @Implement(contract.money.transactions.update)
    update() {
        return implement(contract.money.transactions.update).handler(({ input }) =>
            this.transactions.update(input.id, {
                description: input.description,
                amount: input.amount,
                note: input.note,
                status: input.status as never,
            })
        );
    }

    @Implement(contract.money.transactions.remove)
    remove() {
        return implement(contract.money.transactions.remove).handler(async ({ input }) => {
            await this.transactions.remove(input.id);
            return { ok: true as const };
        });
    }

    @Implement(contract.money.transactions.importCsv)
    importCsv() {
        return implement(contract.money.transactions.importCsv).handler(({ input }) =>
            this.transactions.importCsv(input.accountId, input.content, input.dryRun)
        );
    }
}
