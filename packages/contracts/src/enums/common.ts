/** Shared string enums — single source of truth for contracts + Nest/MikroORM. */

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
    NL = 'NL',
    EN = 'EN',
}

export enum Theme {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
    SYSTEM = 'SYSTEM',
}

/** Monthly-equivalent multipliers for normalising cadences. */
export const CADENCE_TO_MONTHLY: Record<Cadence, number> = {
    [Cadence.WEEKLY]: 52 / 12,
    [Cadence.MONTHLY]: 1,
    [Cadence.QUARTERLY]: 1 / 3,
    [Cadence.YEARLY]: 1 / 12,
    [Cadence.ONCE]: 0,
};
