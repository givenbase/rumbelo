import { Injectable, Logger } from '@nestjs/common';

import type { Env } from '../../common/config/env.config.js';
import type { BankingPort, BankConnection, BankTransaction } from '../banking.port.js';

/**
 * Enable Banking adapter.
 *
 * Chosen because it is PSD2-licensed in the Netherlands and offers a free
 * "restricted production" tier limited to accounts you link yourself — which is
 * exactly the shape of the first phase of this product (the owner plus friends).
 * Moving beyond that needs a commercial agreement.
 *
 * NOT IMPLEMENTED. The methods below throw rather than returning fake data: a
 * banking adapter that silently returns [] would look like "your bank has no
 * transactions", which is worse than an explicit failure.
 */
@Injectable()
export class EnableBankingAdapter implements BankingPort {
  private readonly logger = new Logger(EnableBankingAdapter.name);

  constructor(private readonly env: Env) {}

  isEnabled(): boolean {
    return this.env.FEATURE_BANK_SYNC && Boolean(this.env.ENABLE_BANKING_APP_ID);
  }

  async listInstitutions(_country: string): Promise<{ id: string; name: string; logo: string | null }[]> {
    throw new Error('EnableBankingAdapter.listInstitutions is not implemented yet');
  }

  async startLink(_institutionId: string, _redirectUrl: string): Promise<{ connectionId: string; authUrl: string }> {
    throw new Error('EnableBankingAdapter.startLink is not implemented yet');
  }

  async getConnection(_connectionId: string): Promise<BankConnection | null> {
    throw new Error('EnableBankingAdapter.getConnection is not implemented yet');
  }

  async fetchTransactions(_connectionId: string, _since: string): Promise<BankTransaction[]> {
    throw new Error('EnableBankingAdapter.fetchTransactions is not implemented yet');
  }
}
