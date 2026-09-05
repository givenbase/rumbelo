import { PlanKey } from '@rumbelo/contracts';

/**
 * Canonical product-tier seed — Rumbelo-owned defaults.
 * Loaded into backoffice.plan by PlanSeeder.
 *
 * Basic may stay €0 or become a small paid tier later without renaming.
 */
export const PLAN_SEED = [
    {
        key: PlanKey.BASIC,
        name: 'Basic',
        rank: 0,
        priceMonthly: '0.00',
        unlocks: [] as string[],
    },
    {
        key: PlanKey.PLUS,
        name: 'Plus',
        rank: 1,
        priceMonthly: '9.00',
        unlocks: ['debt', 'week', 'goals'],
    },
    {
        key: PlanKey.MAX,
        name: 'Max',
        rank: 2,
        priceMonthly: '19.00',
        unlocks: ['income', 'board', 'learn', 'chakra'],
    },
] as const;
