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
    /** allocated − spent (transactions only; ignores fixed commitments). */
    remaining: number;
    /** allocated − spent − committedOut — primary leftover for UI. */
    available: number;
    /** available/allocated, clamped 0..1; null when nothing was allocated. */
    progress: number | null;
    /** (spent + committedOut)/allocated for progress bars, clamped 0..1. */
    usedProgress: number | null;
    overspent: boolean;
};

/** available = allocated − spent − committedOut (v1: both subtract; show all three in UI). */
export function jarCoverage(input: JarCoverageInput): JarCoverage {
    const remaining = input.allocated - input.spent;
    const available = remaining - input.committedOut;
    const used = input.spent + input.committedOut;
    return {
        remaining,
        available,
        progress:
            input.allocated > 0 ? Math.min(1, Math.max(0, available / input.allocated)) : null,
        usedProgress: input.allocated > 0 ? Math.min(1, Math.max(0, used / input.allocated)) : null,
        overspent: available < 0,
    };
}

/** 0..100 width for progress bars — overspent jars fill to 100. */
export function usedPctDisplay(coverage: Pick<JarCoverage, 'usedProgress' | 'overspent'>): number {
    if (coverage.overspent) return 100;
    if (coverage.usedProgress === null) return 0;
    return Math.round(coverage.usedProgress * 100);
}

/**
 * Split an amount across weighted shares without losing or inventing a cent.
 * Remainder from floor-rounding goes to the largest share.
 */
export function allocateByPercentage(
    total: number,
    shares: readonly { id: string; percentage: number }[]
): { id: string; amount: number }[] {
    if (shares.length === 0) return [];

    const allocated = shares.map(share => ({
        id: share.id,
        amount: Math.floor((total * share.percentage) / 100),
        percentage: share.percentage,
    }));

    const distributed = allocated.reduce((running, share) => running + share.amount, 0);
    const remainder = total - distributed;

    if (remainder !== 0) {
        const largest = allocated.reduce((left, right) =>
            right.percentage > left.percentage ? right : left
        );
        largest.amount += remainder;
    }

    return allocated.map(({ id, amount }) => ({ id, amount }));
}

/** Planned category envelope = manual budgeted + monthly fixed OUT on that category. */
export function categoryEnvelope(manualBudgeted: number, committedFixedOut: number): number {
    return manualBudgeted + committedFixedOut;
}

export type CategoryVariance = {
    diff: number;
    over: boolean;
};

/** planned − actual; over when spent exceeds planned. */
export function categoryVariance(budgeted: number, actual: number): CategoryVariance {
    const diff = budgeted - actual;
    return { diff, over: diff < 0 };
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

export type FixedOutNetSummary = {
    net: number;
    outTotal: number;
    leftover: number;
    commitmentRatio: number;
};

/** Monthly income vs monthly fixed OUT rollup for headlines. */
export function fixedOutNetSummary(
    incomeItems: readonly { amount: number; cadence: Cadence | string; isActive?: boolean }[],
    outItems: readonly FixedOutLike[],
    opts?: { activeOnly?: boolean }
): FixedOutNetSummary {
    const net = sumMonthly(incomeItems, opts);
    const outTotal = sumMonthlyFixedOut(outItems, opts);
    return {
        net,
        outTotal,
        leftover: net - outTotal,
        commitmentRatio: net > 0 ? Math.round((outTotal / net) * 100) : 0,
    };
}
