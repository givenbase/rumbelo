import { PlanKey } from '../plan.entity';

/**
 * Canonical product-tier seed — Rumbelo-owned defaults.
 * Loaded into backoffice.plan by PlanSeeder.
 *
 * Mirrors apps/application/app/_lib/plan.ts until the app reads from API.
 */
export const PLAN_SEED = [
    {
        key: PlanKey.GRIP,
        name: 'Grip',
        rank: 0,
        priceMonthly: '0.00',
        unlocks: [] as string[],
    },
    {
        key: PlanKey.RITME,
        name: 'Engine',
        rank: 1,
        priceMonthly: '9.00',
        unlocks: ['debt', 'week', 'goals'],
    },
    {
        key: PlanKey.GROEI,
        name: 'Compound',
        rank: 2,
        priceMonthly: '19.00',
        unlocks: ['income', 'board', 'learn', 'chakra'],
    },
] as const;
