import { PlanKey, PLAN_CAPABILITIES } from '@rumbelo/contracts';

/**
 * Canonical product-tier seed — Rumbelo-owned defaults.
 * Loaded into backoffice.plan by PlanSeeder.
 *
 * Capabilities (members, kinds, screens) live in PLAN_CAPABILITIES —
 * this seed mirrors them into the catalog row. Order is sortOrder only.
 *
 * Basic may stay €0 or become a small paid tier later without renaming.
 */
export const PLAN_SEED = [
    {
        key: PlanKey.BASIC,
        name: 'Basic',
        priceMonthly: '0.00',
        capabilities: PLAN_CAPABILITIES[PlanKey.BASIC],
    },
    {
        key: PlanKey.PLUS,
        name: 'Plus',
        priceMonthly: '9.00',
        capabilities: PLAN_CAPABILITIES[PlanKey.PLUS],
    },
    {
        key: PlanKey.MAX,
        name: 'Max',
        priceMonthly: '19.00',
        capabilities: PLAN_CAPABILITIES[PlanKey.MAX],
    },
] as const;
