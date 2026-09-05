import { DebtKind } from '@rumbelo/contracts';

export const DEBT_PRESET_SEED = [
    { key: 'CREDIT_CARD', name: 'Credit card', kind: DebtKind.CREDIT_CARD },
    { key: 'LOAN', name: 'Loan', kind: DebtKind.LOAN },
    { key: 'STUDENT', name: 'Student loan', kind: DebtKind.STUDENT },
    { key: 'MORTGAGE', name: 'Mortgage', kind: DebtKind.MORTGAGE },
    { key: 'FAMILY', name: 'Family', kind: DebtKind.FAMILY },
    { key: 'OTHER', name: 'Other', kind: DebtKind.OTHER },
] as const;
