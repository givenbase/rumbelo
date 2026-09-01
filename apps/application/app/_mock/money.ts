/** Money-domain fixtures: inbox, vaste lasten, schulden. */

export const mockTransactions = [
  { id: 't1', description: 'Albert Heijn', counterparty: 'AH 1043', amount: -4_285, bookedOn: '2026-08-24', status: 'INBOX', jarKey: null },
  { id: 't2', description: 'August salary', counterparty: 'Employer Ltd', amount: 420_000, bookedOn: '2026-08-24', status: 'SORTED', jarKey: 'NECESSITIES' },
  { id: 't3', description: 'Spotify', counterparty: 'Spotify AB', amount: -1_199, bookedOn: '2026-08-23', status: 'INBOX', jarKey: null },
  { id: 't4', description: 'Train ticket', counterparty: 'NS', amount: -2_340, bookedOn: '2026-08-23', status: 'SORTED', jarKey: 'NECESSITIES' },
  { id: 't5', description: 'Bookstore', counterparty: 'Athenaeum', amount: -3_450, bookedOn: '2026-08-22', status: 'SORTED', jarKey: 'EDUCATION' },
  { id: 't6', description: 'Unknown transaction', counterparty: null, amount: -8_900, bookedOn: '2026-08-21', status: 'INBOX', jarKey: null },
] as const;

export const mockFixedCosts = [
  { id: 'f1', name: 'Rent', amount: -145_000, cadence: 'MONTHLY', dueDay: 1, jarKey: 'NECESSITIES' },
  { id: 'f2', name: 'Health insurance', amount: -14_800, cadence: 'MONTHLY', dueDay: 1, jarKey: 'NECESSITIES' },
  { id: 'f3', name: 'Energy', amount: -12_000, cadence: 'MONTHLY', dueDay: 5, jarKey: 'NECESSITIES' },
  { id: 'f4', name: 'Internet', amount: -4_500, cadence: 'MONTHLY', dueDay: 8, jarKey: 'NECESSITIES' },
  { id: 'f5', name: 'Gym', amount: -3_500, cadence: 'MONTHLY', dueDay: 1, jarKey: 'PLAY' },
] as const;

export const mockDebts = [
  { id: 'd1', name: 'Student loan', kind: 'STUDENT', balance: 1_240_000, interestRate: 2.56, minimumPayment: 8_900 },
  { id: 'd2', name: 'Credit card', kind: 'CREDIT_CARD', balance: 68_000, interestRate: 13.9, minimumPayment: 5_000 },
] as const;
