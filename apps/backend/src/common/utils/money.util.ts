/**
 * Money is integer minor units everywhere in this codebase. These helpers exist so
 * the rounding rule lives in one place — a cent that appears or vanishes during a
 * jar split is a reconciliation bug, not a display quirk.
 */

/**
 * Split an amount across weighted shares without losing or inventing a cent.
 * Remainder from rounding goes to the largest share, which is the convention a
 * user would pick themselves if asked.
 */
export function splitByPercentage(
    total: number,
    shares: { id: string; percentage: number }[]
): { id: string; amount: number }[] {
    if (shares.length === 0) return [];

    const allocated = shares.map(share => ({
        id: share.id,
        amount: Math.floor((total * share.percentage) / 100),
        percentage: share.percentage,
    }));

    const distributed = allocated.reduce((sum, share) => sum + share.amount, 0);
    const remainder = total - distributed;

    if (remainder !== 0) {
        const largest = allocated.reduce((left, right) =>
            right.percentage > left.percentage ? right : left
        );
        largest.amount += remainder;
    }

    return allocated.map(({ id, amount }) => ({ id, amount }));
}

export function sum(values: number[]): number {
    return values.reduce((total, value) => total + value, 0);
}
