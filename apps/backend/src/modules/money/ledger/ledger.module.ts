import { Module } from '@nestjs/common';

import { AccountModule } from './account/account.module';
import { RuleModule } from './rule/rule.module';
import { TransactionModule } from './transaction/transaction.module';

/** The bank reality: accounts, the transactions on them, and the rules that sort them. */
@Module({
    imports: [AccountModule, TransactionModule, RuleModule],
    exports: [AccountModule, TransactionModule, RuleModule],
})
export class LedgerModule {}
