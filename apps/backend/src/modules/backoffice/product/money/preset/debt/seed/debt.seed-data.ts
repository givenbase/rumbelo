import { DebtKind } from '@rumbelo/contracts';

export const DEBT_PRESET_SEED = [
    { key: 'CREDIT_CARD', name: 'Credit card', kind: DebtKind.CREDIT_CARD, icon: '💳' },
    { key: 'LOAN', name: 'Loan', kind: DebtKind.LOAN, icon: '📄' },
    { key: 'STUDENT', name: 'Student loan', kind: DebtKind.STUDENT, icon: '🎓' },
    { key: 'MORTGAGE', name: 'Mortgage', kind: DebtKind.MORTGAGE, icon: '🏠' },
    { key: 'FAMILY', name: 'Family', kind: DebtKind.FAMILY, icon: '🤝' },
    { key: 'OTHER', name: 'Other', kind: DebtKind.OTHER, icon: '📦' },
] as const;
