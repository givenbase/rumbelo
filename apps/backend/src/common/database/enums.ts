/** Enums shared by more than one aggregate. Domain-specific enums stay with their entity. */

export enum Cadence {
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    YEARLY = 'YEARLY',
    ONCE = 'ONCE',
}

export enum FlowDirection {
    IN = 'IN',
    OUT = 'OUT',
}

export enum Currency {
    EUR = 'EUR',
    USD = 'USD',
    GBP = 'GBP',
}
export enum Locale {
    nl = 'nl',
    en = 'en',
}
export enum Theme {
    light = 'light',
    dark = 'dark',
    system = 'system',
}

/** Monthly-equivalent multipliers, used wherever cadences are normalised for comparison. */
export const CADENCE_TO_MONTHLY: Record<Cadence, number> = {
    [Cadence.WEEKLY]: 52 / 12,
    [Cadence.MONTHLY]: 1,
    [Cadence.QUARTERLY]: 1 / 3,
    [Cadence.YEARLY]: 1 / 12,
    [Cadence.ONCE]: 0,
};
