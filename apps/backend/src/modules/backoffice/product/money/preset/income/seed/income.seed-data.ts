import { Cadence, IncomeKind } from '@rumbelo/contracts';

const monthly = Cadence.MONTHLY;
const quarterly = Cadence.QUARTERLY;
const yearly = Cadence.YEARLY;
const weekly = Cadence.WEEKLY;

/**
 * English income-name suggestions for create forms.
 * Multiple presets can share the same IncomeKind — kind drives analytics; name is what the user sees.
 */
export const INCOME_SOURCE_PRESET_SEED = [
    // Employment / salary
    { key: 'SALARY', name: 'Salary', kind: IncomeKind.SALARY, defaultCadence: monthly },
    {
        key: 'PARTNER_SALARY',
        name: 'Partner salary',
        kind: IncomeKind.SALARY,
        defaultCadence: monthly,
    },
    {
        key: 'PART_TIME_JOB',
        name: 'Part-time job',
        kind: IncomeKind.SALARY,
        defaultCadence: monthly,
    },
    { key: 'SIDE_JOB', name: 'Side job', kind: IncomeKind.SALARY, defaultCadence: monthly },
    { key: 'INTERNSHIP', name: 'Internship', kind: IncomeKind.SALARY, defaultCadence: monthly },
    { key: 'HOLIDAY_PAY', name: 'Holiday pay', kind: IncomeKind.SALARY, defaultCadence: yearly },
    {
        key: 'THIRTEENTH_MONTH',
        name: '13th month',
        kind: IncomeKind.SALARY,
        defaultCadence: yearly,
    },
    { key: 'BONUS', name: 'Bonus', kind: IncomeKind.SALARY, defaultCadence: yearly },
    { key: 'OVERTIME', name: 'Overtime', kind: IncomeKind.SALARY, defaultCadence: monthly },
    { key: 'COMMISSION', name: 'Commission', kind: IncomeKind.SALARY, defaultCadence: monthly },

    // Freelance / self-employed
    { key: 'FREELANCE', name: 'Freelance', kind: IncomeKind.FREELANCE, defaultCadence: monthly },
    {
        key: 'SELF_EMPLOYED',
        name: 'Self-employed income',
        kind: IncomeKind.FREELANCE,
        defaultCadence: monthly,
    },
    {
        key: 'CONTRACTING',
        name: 'Contracting',
        kind: IncomeKind.FREELANCE,
        defaultCadence: monthly,
    },
    { key: 'CONSULTING', name: 'Consulting', kind: IncomeKind.FREELANCE, defaultCadence: monthly },
    { key: 'GIG_WORK', name: 'Gig work', kind: IncomeKind.FREELANCE, defaultCadence: weekly },
    {
        key: 'CREATOR_INCOME',
        name: 'Creator income',
        kind: IncomeKind.FREELANCE,
        defaultCadence: monthly,
    },
    {
        key: 'BUSINESS_PROFIT',
        name: 'Business profit',
        kind: IncomeKind.FREELANCE,
        defaultCadence: monthly,
    },

    // Benefits / government / student / elderly
    { key: 'BENEFIT', name: 'Benefit', kind: IncomeKind.BENEFIT, defaultCadence: monthly },
    {
        key: 'UNEMPLOYMENT_BENEFIT',
        name: 'Unemployment benefit',
        kind: IncomeKind.BENEFIT,
        defaultCadence: monthly,
    },
    {
        key: 'DISABILITY_BENEFIT',
        name: 'Disability benefit',
        kind: IncomeKind.BENEFIT,
        defaultCadence: monthly,
    },
    {
        key: 'STUDENT_GRANT',
        name: 'Student grant',
        kind: IncomeKind.BENEFIT,
        defaultCadence: monthly,
    },
    {
        key: 'STUDENT_LOAN_INCOME',
        name: 'Student loan (incoming)',
        kind: IncomeKind.BENEFIT,
        defaultCadence: monthly,
    },
    {
        key: 'CHILD_BENEFIT',
        name: 'Child benefit',
        kind: IncomeKind.BENEFIT,
        defaultCadence: monthly,
    },
    {
        key: 'HOUSING_ALLOWANCE',
        name: 'Housing allowance',
        kind: IncomeKind.BENEFIT,
        defaultCadence: monthly,
    },
    {
        key: 'CARE_ALLOWANCE',
        name: 'Care allowance',
        kind: IncomeKind.BENEFIT,
        defaultCadence: monthly,
    },
    { key: 'PENSION', name: 'Pension', kind: IncomeKind.BENEFIT, defaultCadence: monthly },
    {
        key: 'STATE_PENSION',
        name: 'State pension',
        kind: IncomeKind.BENEFIT,
        defaultCadence: monthly,
    },
    {
        key: 'COMPANY_PENSION',
        name: 'Company pension',
        kind: IncomeKind.BENEFIT,
        defaultCadence: monthly,
    },

    // Rental / property
    { key: 'RENTAL', name: 'Rental income', kind: IncomeKind.RENTAL, defaultCadence: monthly },
    {
        key: 'ROOM_RENTAL',
        name: 'Room rental',
        kind: IncomeKind.RENTAL,
        defaultCadence: monthly,
    },
    {
        key: 'HOLIDAY_RENTAL',
        name: 'Holiday rental',
        kind: IncomeKind.RENTAL,
        defaultCadence: monthly,
    },
    {
        key: 'PARKING_RENTAL',
        name: 'Parking / storage rental',
        kind: IncomeKind.RENTAL,
        defaultCadence: monthly,
    },

    // Investments
    { key: 'DIVIDEND', name: 'Dividend', kind: IncomeKind.DIVIDEND, defaultCadence: quarterly },
    {
        key: 'INTEREST_INCOME',
        name: 'Interest income',
        kind: IncomeKind.DIVIDEND,
        defaultCadence: monthly,
    },
    {
        key: 'INVESTMENT_PAYOUT',
        name: 'Investment payout',
        kind: IncomeKind.DIVIDEND,
        defaultCadence: quarterly,
    },
    {
        key: 'CRYPTO_INCOME',
        name: 'Crypto income',
        kind: IncomeKind.DIVIDEND,
        defaultCadence: monthly,
    },

    // Other common household inflows
    { key: 'OTHER', name: 'Other', kind: IncomeKind.OTHER, defaultCadence: monthly },
    {
        key: 'ALIMONY_IN',
        name: 'Alimony (incoming)',
        kind: IncomeKind.OTHER,
        defaultCadence: monthly,
    },
    {
        key: 'CHILD_SUPPORT_IN',
        name: 'Child support (incoming)',
        kind: IncomeKind.OTHER,
        defaultCadence: monthly,
    },
    {
        key: 'FAMILY_SUPPORT',
        name: 'Family support',
        kind: IncomeKind.OTHER,
        defaultCadence: monthly,
    },
    {
        key: 'GIFT_INCOME',
        name: 'Gift / inheritance',
        kind: IncomeKind.OTHER,
        defaultCadence: yearly,
    },
    { key: 'TAX_REFUND', name: 'Tax refund', kind: IncomeKind.OTHER, defaultCadence: yearly },
    {
        key: 'INSURANCE_PAYOUT',
        name: 'Insurance payout',
        kind: IncomeKind.OTHER,
        defaultCadence: yearly,
    },
    { key: 'SCHOLARSHIP', name: 'Scholarship', kind: IncomeKind.OTHER, defaultCadence: monthly },
    { key: 'ROYALTIES', name: 'Royalties', kind: IncomeKind.OTHER, defaultCadence: quarterly },
    {
        key: 'REIMBURSEMENT',
        name: 'Expense reimbursement',
        kind: IncomeKind.OTHER,
        defaultCadence: monthly,
    },
] as const;
