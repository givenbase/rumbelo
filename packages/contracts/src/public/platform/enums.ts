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
    WEEK_CHECK = 'WEEK_CHECK',
}

/**
 * Soft self-declared spending style — person-scoped.
 * Descriptive, never judgmental (“leans spender”).
 */
export enum SpendingStyle {
    SPENDER = 'SPENDER',
    SAVER = 'SAVER',
    BALANCED = 'BALANCED',
    UNKNOWN = 'UNKNOWN',
}

/**
 * Board-level income volatility — shared cash-flow picture for coaching.
 * NONE = no recurring inflow right now (same coaching case as ~€0 net).
 */
export enum IncomeStability {
    STABLE = 'STABLE',
    VARIABLE = 'VARIABLE',
    NONE = 'NONE',
}
