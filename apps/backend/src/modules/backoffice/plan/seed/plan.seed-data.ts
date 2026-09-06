import { PlanKey, PLAN_CAPABILITIES } from '@rumbelo/contracts';

/**
 * Commercial plan rows (Basic / Plus / Max).
 *
 * What each plan can *do* is not listed here — see capability.seed-data.ts:
 *   CAPABILITY_SEED       → all featureKeys
 *   PLAN_CAPABILITY_SEED  → plan ↔ featureKey links
 *   PLAN_ACCESS_SEED      → plan → product → featureKeys
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
