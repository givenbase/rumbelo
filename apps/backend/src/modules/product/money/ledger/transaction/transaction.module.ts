import { Module } from '@nestjs/common';

import { RuleModule } from '../rule/rule.module';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
    imports: [RuleModule],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule {}
