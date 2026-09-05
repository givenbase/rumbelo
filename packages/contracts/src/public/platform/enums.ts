/** Platform / household / coach enums. */

export enum HouseholdKind {
    FAMILY = 'FAMILY',
    PARTNERS = 'PARTNERS',
    FRIENDS = 'FRIENDS',
    SOLO = 'SOLO',
}

export enum HouseholdRole {
    OWNER = 'OWNER',
    MEMBER = 'MEMBER',
    VIEWER = 'VIEWER',
}

export enum CoachKind {
    NUDGE = 'NUDGE',
    WIN = 'WIN',
    WARNING = 'WARNING',
    INSIGHT = 'INSIGHT',
    RITUAL = 'RITUAL',
}

/**
 * Soft self-declared money style — person-scoped.
 * Descriptive, never judgmental (“leans spender”).
 */
export enum MoneyCharacter {
    SPENDER = 'SPENDER',
    SAVER = 'SAVER',
    BALANCED = 'BALANCED',
    UNKNOWN = 'UNKNOWN',
}

/** Board-level income volatility — shared cash-flow picture. */
export enum IncomeRhythm {
    STABLE = 'STABLE',
    VARIABLE = 'VARIABLE',
}
