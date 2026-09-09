import { DebtKind } from '@rumtelo/contracts';

/**
 * Debt types for “New debt”.
 * suggestedLenders = “who do you owe?” chips after the type is picked (plain names).
 * Merchants stay expense/inbox-only — no coupling.
 */
export const DEBT_PRESET_SEED = [
    {
        key: 'CREDIT_CARD',
        name: 'Credit card',
        kind: DebtKind.CREDIT_CARD,
        icon: '💳',
        suggestedLenders: [] as string[],
    },
    {
        key: 'STUDENT',
        name: 'Student loan',
        kind: DebtKind.STUDENT,
        icon: '🎓',
        suggestedLenders: ['DUO'],
    },
    {
        key: 'MORTGAGE',
        name: 'Mortgage',
        kind: DebtKind.MORTGAGE,
        icon: '🏠',
        suggestedLenders: [] as string[],
    },
    {
        key: 'LOAN',
        name: 'Personal loan',
        kind: DebtKind.LOAN,
        icon: '📄',
        suggestedLenders: [] as string[],
    },
    {
        key: 'CAR_LOAN',
        name: 'Car loan / private lease',
        kind: DebtKind.LOAN,
        icon: '🚗',
        suggestedLenders: [] as string[],
    },
    {
        key: 'PHONE_PLAN',
        name: 'Phone / device plan',
        kind: DebtKind.LOAN,
        icon: '📱',
        suggestedLenders: [] as string[],
    },
    {
        key: 'BNPL',
        name: 'Buy now, pay later',
        kind: DebtKind.OTHER,
        icon: '🛍️',
        suggestedLenders: ['Klarna', 'Afterpay / Riverty'],
    },
    {
        key: 'GOV_PLAN',
        name: 'Government payment plan',
        kind: DebtKind.OTHER,
        icon: '🏛️',
        suggestedLenders: ['Belastingdienst', 'CJIB'],
    },
    {
        key: 'OVERDRAFT',
        name: 'Overdraft / roodstand',
        kind: DebtKind.OTHER,
        icon: '🏦',
        suggestedLenders: [] as string[],
    },
    {
        key: 'FAMILY',
        name: 'Family / friends',
        kind: DebtKind.FAMILY,
        icon: '🤝',
        suggestedLenders: [] as string[],
    },
    {
        key: 'OTHER',
        name: 'Other',
        kind: DebtKind.OTHER,
        icon: '📦',
        suggestedLenders: [] as string[],
    },
] as const;
