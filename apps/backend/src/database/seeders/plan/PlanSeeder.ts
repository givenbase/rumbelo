import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';
import { PLAN_CAPABILITIES, type CapabilityKey, type PlanKey } from '@rumbelo/contracts';

import { Capability } from '../../../modules/backoffice/plan/capability.entity';
import { Plan } from '../../../modules/backoffice/plan/plan.entity';
import { PlanCapability } from '../../../modules/backoffice/plan/plan-capability.entity';
import {
    CAPABILITY_SEED,
    PLAN_CAPABILITY_SEED,
} from '../../../modules/backoffice/plan/seed/capability.seed-data';
import { PLAN_SEED } from '../../../modules/backoffice/plan/seed/plan.seed-data';

/**
 * Seeds:
 *   1. backoffice.plan              — Basic / Plus / Max
 *   2. backoffice.capability        — every featureKey
 *   3. backoffice.plan_capability   — which plan unlocks which featureKey
 *
 * Data: seed/capability.seed-data.ts + seed/plan.seed-data.ts
 */
export class PlanSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        await this.seedPlans(em);
        await this.seedCapabilities(em);
        await this.seedGrants(em);
        await em.flush();
    }

    private async seedPlans(em: EntityManager): Promise<void> {
        const keys = PLAN_SEED.map(row => row.key);
        const existingRows = await em.find(Plan, { key: { $in: keys } });
        const existingByKey = new Map(existingRows.map(row => [row.key, row]));

        for (const [sortOrder, row] of PLAN_SEED.entries()) {
            const existing = existingByKey.get(row.key);
            if (existing) {
                existing.name = row.name;
                existing.priceMonthly = row.priceMonthly;
                existing.capabilities = { ...PLAN_CAPABILITIES[row.key] };
                existing.sortOrder = sortOrder;
                existing.isActive = true;
                continue;
            }
            em.create(Plan, {
                key: row.key,
                name: row.name,
                priceMonthly: row.priceMonthly,
                capabilities: { ...PLAN_CAPABILITIES[row.key] },
                sortOrder,
                isActive: true,
            } as never);
        }
        await em.flush();
    }

    private async seedCapabilities(em: EntityManager): Promise<void> {
        const keys = CAPABILITY_SEED.map(row => row.key);
        const existingRows = await em.find(Capability, { key: { $in: keys } });
        const existingByKey = new Map(existingRows.map(row => [row.key, row]));

        for (const row of CAPABILITY_SEED) {
            const existing = existingByKey.get(row.key);
            if (existing) {
                existing.product = row.product;
                existing.feature = row.feature;
                existing.name = row.name;
                existing.description = row.description;
                existing.kind = row.kind;
                existing.sortOrder = row.sortOrder;
                existing.isActive = true;
                continue;
            }
            em.create(Capability, {
                key: row.key,
                product: row.product,
                feature: row.feature,
                name: row.name,
                description: row.description,
                kind: row.kind,
                sortOrder: row.sortOrder,
                isActive: true,
            } as never);
        }
        await em.flush();
    }

    private async seedGrants(em: EntityManager): Promise<void> {
        const plans = await em.find(Plan, {});
        const capabilities = await em.find(Capability, {});
        const planByKey = new Map(plans.map(plan => [plan.key, plan]));
        const capabilityByKey = new Map(
            capabilities.map(capability => [capability.key as CapabilityKey, capability])
        );

        const existingGrants = await em.find(PlanCapability, {}, { populate: ['capability'] });
        const existingPair = new Set(
            existingGrants.map(grant => `${grant.planKey}:${grant.capability.key}`)
        );

        const desiredPairs = new Set(
            PLAN_CAPABILITY_SEED.map(row => `${row.planKey}:${row.capabilityKey}`)
        );

        for (const grant of existingGrants) {
            const pair = `${grant.planKey}:${grant.capability.key}`;
            if (!desiredPairs.has(pair)) {
                em.remove(grant);
            }
        }

        for (const row of PLAN_CAPABILITY_SEED) {
            const pair = `${row.planKey}:${row.capabilityKey}`;
            if (existingPair.has(pair)) continue;

            const plan = planByKey.get(row.planKey as PlanKey);
            const capability = capabilityByKey.get(row.capabilityKey);
            if (!plan || !capability) continue;

            em.create(PlanCapability, {
                planKey: row.planKey,
                plan,
                capability,
            } as never);
        }
    }
}
