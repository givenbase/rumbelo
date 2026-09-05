import { Cadence, IncomeKind } from '@rumbelo/contracts';

const M = Cadence.MONTHLY;
const Q = Cadence.QUARTERLY;
const Y = Cadence.YEARLY;
const W = Cadence.WEEKLY;

/**
 * English income-name suggestions for create forms.
 * Multiple presets can share the same IncomeKind — kind drives analytics; name is what the user sees.
 */
export const INCOME_SOURCE_PRESET_SEED = [
    // Employment / salary
    { key: 'SALARY', name: 'Salary', kind: IncomeKind.SALARY, defaultCadence: M },
    { key: 'PARTNER_SALARY', name: 'Partner salary', kind: IncomeKind.SALARY, defaultCadence: M },
    { key: 'PART_TIME_JOB', name: 'Part-time job', kind: IncomeKind.SALARY, defaultCadence: M },
    { key: 'SIDE_JOB', name: 'Side job', kind: IncomeKind.SALARY, defaultCadence: M },
    { key: 'INTERNSHIP', name: 'Internship', kind: IncomeKind.SALARY, defaultCadence: M },
    { key: 'HOLIDAY_PAY', name: 'Holiday pay', kind: IncomeKind.SALARY, defaultCadence: Y },
    { key: 'THIRTEENTH_MONTH', name: '13th month', kind: IncomeKind.SALARY, defaultCadence: Y },
    { key: 'BONUS', name: 'Bonus', kind: IncomeKind.SALARY, defaultCadence: Y },
    { key: 'OVERTIME', name: 'Overtime', kind: IncomeKind.SALARY, defaultCadence: M },
    { key: 'COMMISSION', name: 'Commission', kind: IncomeKind.SALARY, defaultCadence: M },

    // Freelance / self-employed
    { key: 'FREELANCE', name: 'Freelance', kind: IncomeKind.FREELANCE, defaultCadence: M },
    {
        key: 'SELF_EMPLOYED',
        name: 'Self-employed income',
        kind: IncomeKind.FREELANCE,
        defaultCadence: M,
    },
    { key: 'CONTRACTING', name: 'Contracting', kind: IncomeKind.FREELANCE, defaultCadence: M },
    { key: 'CONSULTING', name: 'Consulting', kind: IncomeKind.FREELANCE, defaultCadence: M },
    { key: 'GIG_WORK', name: 'Gig work', kind: IncomeKind.FREELANCE, defaultCadence: W },
    {
        key: 'CREATOR_INCOME',
        name: 'Creator income',
        kind: IncomeKind.FREELANCE,
        defaultCadence: M,
    },
    {
        key: 'BUSINESS_PROFIT',
        name: 'Business profit',
        kind: IncomeKind.FREELANCE,
        defaultCadence: M,
    },

    // Benefits / government / student / elderly
    { key: 'BENEFIT', name: 'Benefit', kind: IncomeKind.BENEFIT, defaultCadence: M },
    {
        key: 'UNEMPLOYMENT_BENEFIT',
        name: 'Unemployment benefit',
        kind: IncomeKind.BENEFIT,
        defaultCadence: M,
    },
    {
        key: 'DISABILITY_BENEFIT',
        name: 'Disability benefit',
        kind: IncomeKind.BENEFIT,
        defaultCadence: M,
    },
    {
        key: 'STUDENT_GRANT',
        name: 'Student grant',
        kind: IncomeKind.BENEFIT,
        defaultCadence: M,
    },
    {
        key: 'STUDENT_LOAN_INCOME',
        name: 'Student loan (incoming)',
        kind: IncomeKind.BENEFIT,
        defaultCadence: M,
    },
    {
        key: 'CHILD_BENEFIT',
        name: 'Child benefit',
        kind: IncomeKind.BENEFIT,
        defaultCadence: M,
    },
    {
        key: 'HOUSING_ALLOWANCE',
        name: 'Housing allowance',
        kind: IncomeKind.BENEFIT,
        defaultCadence: M,
    },
    {
        key: 'CARE_ALLOWANCE',
        name: 'Care allowance',
        kind: IncomeKind.BENEFIT,
        defaultCadence: M,
    },
    { key: 'PENSION', name: 'Pension', kind: IncomeKind.BENEFIT, defaultCadence: M },
    {
        key: 'STATE_PENSION',
        name: 'State pension',
        kind: IncomeKind.BENEFIT,
        defaultCadence: M,
    },
    {
        key: 'COMPANY_PENSION',
        name: 'Company pension',
        kind: IncomeKind.BENEFIT,
        defaultCadence: M,
    },

    // Rental / property
    { key: 'RENTAL', name: 'Rental income', kind: IncomeKind.RENTAL, defaultCadence: M },
    {
        key: 'ROOM_RENTAL',
        name: 'Room rental',
        kind: IncomeKind.RENTAL,
        defaultCadence: M,
    },
    {
        key: 'HOLIDAY_RENTAL',
        name: 'Holiday rental',
        kind: IncomeKind.RENTAL,
        defaultCadence: M,
    },
    {
        key: 'PARKING_RENTAL',
        name: 'Parking / storage rental',
        kind: IncomeKind.RENTAL,
        defaultCadence: M,
    },

    // Investments
    { key: 'DIVIDEND', name: 'Dividend', kind: IncomeKind.DIVIDEND, defaultCadence: Q },
    {
        key: 'INTEREST_INCOME',
        name: 'Interest income',
        kind: IncomeKind.DIVIDEND,
        defaultCadence: M,
    },
    {
        key: 'INVESTMENT_PAYOUT',
        name: 'Investment payout',
        kind: IncomeKind.DIVIDEND,
        defaultCadence: Q,
    },
    {
        key: 'CRYPTO_INCOME',
        name: 'Crypto income',
        kind: IncomeKind.DIVIDEND,
        defaultCadence: M,
    },

    // Other common household inflows
    { key: 'OTHER', name: 'Other', kind: IncomeKind.OTHER, defaultCadence: M },
    { key: 'ALIMONY_IN', name: 'Alimony (incoming)', kind: IncomeKind.OTHER, defaultCadence: M },
    {
        key: 'CHILD_SUPPORT_IN',
        name: 'Child support (incoming)',
        kind: IncomeKind.OTHER,
        defaultCadence: M,
    },
    {
        key: 'FAMILY_SUPPORT',
        name: 'Family support',
        kind: IncomeKind.OTHER,
        defaultCadence: M,
    },
    { key: 'GIFT_INCOME', name: 'Gift / inheritance', kind: IncomeKind.OTHER, defaultCadence: Y },
    { key: 'TAX_REFUND', name: 'Tax refund', kind: IncomeKind.OTHER, defaultCadence: Y },
    {
        key: 'INSURANCE_PAYOUT',
        name: 'Insurance payout',
        kind: IncomeKind.OTHER,
        defaultCadence: Y,
    },
    { key: 'SCHOLARSHIP', name: 'Scholarship', kind: IncomeKind.OTHER, defaultCadence: M },
    { key: 'ROYALTIES', name: 'Royalties', kind: IncomeKind.OTHER, defaultCadence: Q },
    {
        key: 'REIMBURSEMENT',
        name: 'Expense reimbursement',
        kind: IncomeKind.OTHER,
        defaultCadence: M,
    },
] as const;
