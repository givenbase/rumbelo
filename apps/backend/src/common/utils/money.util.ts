/**
 * Money is integer minor units everywhere in this codebase.
 * Domain maths live in `@rumbelo/utils` — this file re-exports for backend call sites.
 */

export {
    allocateByPercentage as splitByPercentage,
    sumMonthly,
    monthlyAmount,
} from '@rumbelo/utils';

export function sum(values: number[]): number {
    return values.reduce((total, value) => total + value, 0);
}
