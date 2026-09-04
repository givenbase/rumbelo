import { Module } from '@nestjs/common';

import { NullBankingAdapter } from './adapters/null-banking.adapter';
import { BANKING_PORT } from './banking.port';

/**
 * Binds the null adapter by default. Swap the provider for EnableBankingAdapter
 * once credentials exist — nothing downstream changes.
 */
@Module({
    providers: [{ provide: BANKING_PORT, useClass: NullBankingAdapter }],
    exports: [BANKING_PORT],
})
export class BankingModule {}
