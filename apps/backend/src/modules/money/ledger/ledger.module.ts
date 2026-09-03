import { Module } from '@nestjs/common';

import { AccountModule } from './account/account.module.js';
import { RuleModule } from './rule/rule.module.js';
import { TransactionModule } from './transaction/transaction.module.js';

/** The bank reality: accounts, the transactions on them, and the rules that sort them. */
@Module({
    imports: [AccountModule, TransactionModule, RuleModule],
    exports: [AccountModule, TransactionModule, RuleModule],
})
export class LedgerModule {}
