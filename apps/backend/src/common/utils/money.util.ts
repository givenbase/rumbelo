/**
 * Money is integer minor units everywhere in this codebase.
 * Domain maths live in `@rumtelo/utils` — this file re-exports for backend call sites.
 */

export {
    allocateByPercentage as splitByPercentage,
    sumMonthly,
    monthlyAmount,
    toMinorUnits,
    fromMinorUnits,
} from '@rumtelo/utils';

export function sum(values: number[]): number {
    return values.reduce((total, value) => total + value, 0);
}
