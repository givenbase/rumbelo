/**
 * Bank aggregation port.
 *
 * Deliberately an interface with a null implementation by default. The free
 * self-serve tier that hobby projects relied on (GoCardless Bank Account Data,
 * formerly Nordigen) closed to new signups, so live bank access now needs a paid
 * or restricted-production agreement. CSV import is therefore the always-on path
 * and this port stays dark until FEATURE_BANK_SYNC is enabled with credentials.
 *
 * Keeping it behind a port means the adapter can be swapped — Enable Banking,
 * Tink, Yapily — without touching TransactionService.
 */

export interface BankConnection {
  id: string;
  institutionId: string;
  institutionName: string;
  status: 'PENDING' | 'LINKED' | 'EXPIRED' | 'REVOKED';
  /** PSD2 consents expire, typically after 90 days; the UI must warn before this. */
  expiresAt: string | null;
}

export interface BankTransaction {
  externalId: string;
  bookedOn: string;
  amount: number;
  description: string;
  counterparty: string | null;
}

export interface BankingPort {
  isEnabled(): boolean;
  listInstitutions(country: string): Promise<{ id: string; name: string; logo: string | null }[]>;
  startLink(institutionId: string, redirectUrl: string): Promise<{ connectionId: string; authUrl: string }>;
  getConnection(connectionId: string): Promise<BankConnection | null>;
  fetchTransactions(connectionId: string, since: string): Promise<BankTransaction[]>;
}

export const BANKING_PORT = Symbol('BANKING_PORT');
