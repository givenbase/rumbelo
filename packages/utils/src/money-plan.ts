import { CADENCE_TO_MONTHLY, type Cadence } from '@rumbelo/contracts';

/** Convert a cadence amount to a monthly-equivalent (integer minor units). */
export function monthlyAmount(amount: number, cadence: Cadence | string): number {
    const factor = CADENCE_TO_MONTHLY[cadence as Cadence] ?? 0;
    return Math.round(amount * factor);
}

export type JarCoverageInput = {
    allocated: number;
    spent: number;
    committedOut: number;
};

export type JarCoverage = {
    available: number;
    /** available/allocated, clamped 0..1; null when nothing was allocated. */
    progress: number | null;
    overspent: boolean;
};

/** available = allocated − spent − committedOut (v1: both subtract; show all three in UI). */
export function jarCoverage(input: JarCoverageInput): JarCoverage {
    const available = input.allocated - input.spent - input.committedOut;
    return {
        available,
        progress:
            input.allocated > 0 ? Math.min(1, Math.max(0, available / input.allocated)) : null,
        overspent: available < 0,
    };
}

type FixedOutLike = {
    amount: number;
    cadence: Cadence | string;
    direction?: string;
    isActive?: boolean;
};

/**
 * Sum monthly-normalised OUT fixed costs.
 * Pass already-filtered OUT items, or include direction/isActive for filtering.
 */
export function sumMonthlyFixedOut(
    items: readonly FixedOutLike[],
    opts?: { activeOnly?: boolean }
): number {
    const activeOnly = opts?.activeOnly ?? true;
    return items.reduce((total, item) => {
        if (item.direction !== undefined && item.direction !== 'OUT') return total;
        if (activeOnly && item.isActive === false) return total;
        return total + monthlyAmount(Math.abs(item.amount), item.cadence);
    }, 0);
}

/** Sum monthly-normalised amounts (e.g. income sources). */
export function sumMonthly(
    items: readonly { amount: number; cadence: Cadence | string; isActive?: boolean }[],
    opts?: { activeOnly?: boolean }
): number {
    const activeOnly = opts?.activeOnly ?? true;
    return items.reduce((total, item) => {
        if (activeOnly && item.isActive === false) return total;
        return total + monthlyAmount(item.amount, item.cadence);
    }, 0);
}
