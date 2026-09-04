import { contract } from '@rumbelo/contracts';

import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { AccountService } from './account.service';

/** Transport only. Handler order is always CRUD. */
@Controller()
export class AccountController {
    constructor(private readonly accounts: AccountService) {}

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    /** Register a new bank account for this household. */
    @Implement(contract.money.accounts.create)
    create() {
        return implement(contract.money.accounts.create).handler(({ input }) =>
            this.accounts.create(input)
        );
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Return all accounts belonging to the current household. */
    @Implement(contract.money.accounts.list)
    list() {
        return implement(contract.money.accounts.list).handler(() => this.accounts.list());
    }
}
