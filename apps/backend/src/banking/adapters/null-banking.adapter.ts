import { Injectable } from '@nestjs/common';

import type { BankingPort } from '../banking.port.js';

/**
 * Default adapter. Reports the feature as unavailable rather than throwing, so
 * the UI can render "verbind je bank" as a disabled state instead of an error.
 */
@Injectable()
export class NullBankingAdapter implements BankingPort {
    isEnabled() {
        return false;
    }
    async listInstitutions() {
        return [];
    }
    async startLink(): Promise<never> {
        throw new Error(
            'Bank sync is disabled. Set FEATURE_BANK_SYNC and configure an aggregator.'
        );
    }
    async getConnection() {
        return null;
    }
    async fetchTransactions() {
        return [];
    }
}
