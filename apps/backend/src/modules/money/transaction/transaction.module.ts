import { Module } from '@nestjs/common';

import { RuleModule } from '../rule/rule.module.js';
import { TransactionController } from './transaction.controller.js';
import { TransactionService } from './transaction.service.js';

@Module({
    imports: [RuleModule],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService],
})
export class TransactionModule {}
