import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { AccountService } from './account.service';

/** Accounts live under the transactions contract namespace but are their own aggregate. */
@Controller()
export class AccountController {
    constructor(private readonly accounts: AccountService) {}

    @Implement(contract.money.accounts.list)
    list() {
        return implement(contract.money.accounts.list).handler(() => this.accounts.list());
    }

    @Implement(contract.money.accounts.create)
    create() {
        return implement(contract.money.accounts.create).handler(({ input }) =>
            this.accounts.create(input)
        );
    }
}
