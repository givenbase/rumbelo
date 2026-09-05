/** Money-domain string enums — jars, ledger, targets, rhythm. */

export enum JarKey {
    NECESSITIES = 'NECESSITIES',
    FINANCIAL_FREEDOM = 'FINANCIAL_FREEDOM',
    EDUCATION = 'EDUCATION',
    LONG_TERM_SAVINGS = 'LONG_TERM_SAVINGS',
    PLAY = 'PLAY',
    GIVE = 'GIVE',
}

export enum DebtKind {
    CREDIT_CARD = 'CREDIT_CARD',
    LOAN = 'LOAN',
    STUDENT = 'STUDENT',
    MORTGAGE = 'MORTGAGE',
    FAMILY = 'FAMILY',
    OTHER = 'OTHER',
}

/** Avalanche = highest rate first. Snowball = smallest balance first. */
export enum PayoffStrategy {
    AVALANCHE = 'AVALANCHE',
    SNOWBALL = 'SNOWBALL',
}

export enum IncomeKind {
    SALARY = 'SALARY',
    FREELANCE = 'FREELANCE',
    BENEFIT = 'BENEFIT',
    RENTAL = 'RENTAL',
    DIVIDEND = 'DIVIDEND',
    OTHER = 'OTHER',
}

export enum GoalStatus {
    ACTIVE = 'ACTIVE',
    REACHED = 'REACHED',
    PAUSED = 'PAUSED',
    ARCHIVED = 'ARCHIVED',
}

export enum AccountKind {
    CHECKING = 'CHECKING',
    SAVINGS = 'SAVINGS',
    CREDIT = 'CREDIT',
    CASH = 'CASH',
    INVESTMENT = 'INVESTMENT',
}

export enum TransactionStatus {
    INBOX = 'INBOX',
    SORTED = 'SORTED',
    IGNORED = 'IGNORED',
}

export enum TransactionSource {
    MANUAL = 'MANUAL',
    CSV = 'CSV',
    BANK = 'BANK',
    RECURRING = 'RECURRING',
}

export enum RuleField {
    DESCRIPTION = 'DESCRIPTION',
    COUNTERPARTY = 'COUNTERPARTY',
    AMOUNT = 'AMOUNT',
}

export enum RuleMatcher {
    CONTAINS = 'CONTAINS',
    EQUALS = 'EQUALS',
    STARTS_WITH = 'STARTS_WITH',
    REGEX = 'REGEX',
}

export enum RitualStage {
    LOOK = 'LOOK',
    REDIRECT = 'REDIRECT',
    INTEND = 'INTEND',
    DONE = 'DONE',
}

export enum TurnEventKind {
    JAR_HELD = 'JAR_HELD',
    JAR_OVERSPENT = 'JAR_OVERSPENT',
    INBOX_CLEARED = 'INBOX_CLEARED',
    RITUAL_DONE = 'RITUAL_DONE',
    GOAL_REACHED = 'GOAL_REACHED',
    DEBT_CLEARED = 'DEBT_CLEARED',
    INCOME_LOGGED = 'INCOME_LOGGED',
    STREAK_KEPT = 'STREAK_KEPT',
}
