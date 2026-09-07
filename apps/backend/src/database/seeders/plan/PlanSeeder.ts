import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';
import { PLAN_CAPABILITIES, type CapabilityKey, type PlanKey } from '@rumbelo/contracts';

import { Capability } from '../../../modules/backoffice/plan/capability/capability.entity';
import {
    CAPABILITY_SEED,
    PLAN_CAPABILITY_SEED,
} from '../../../modules/backoffice/plan/capability/seed/capability.seed-data';
import { PlanFeature } from '../../../modules/backoffice/plan/feature/feature.entity';
import { PLAN_FEATURE_SEED } from '../../../modules/backoffice/plan/feature/seed/feature.seed-data';
import { Plan } from '../../../modules/backoffice/plan/plan.entity';
import { PlanCapability } from '../../../modules/backoffice/plan/plan-capability/plan-capability.entity';
import { PlanProduct } from '../../../modules/backoffice/plan/product/product.entity';
import { PLAN_PRODUCT_SEED } from '../../../modules/backoffice/plan/product/seed/product.seed-data';
import { PLAN_SEED } from '../../../modules/backoffice/plan/seed/plan.seed-data';

/**
 * Seeds (order matters):
 *   1. plan_product
 *   2. plan_feature
 *   3. capability (FK → feature)
 *   4. plan
 *   5. plan_capability grants
 */
export class PlanSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        await this.seedProducts(em);
        await this.seedFeatures(em);
        await this.seedCapabilities(em);
        await this.seedPlans(em);
        await this.seedGrants(em);
        await em.flush();
    }

    private async seedProducts(em: EntityManager): Promise<void> {
        const keys = PLAN_PRODUCT_SEED.map(row => row.key);
        const existingRows = await em.find(PlanProduct, { key: { $in: keys } });
        const existingByKey = new Map(existingRows.map(row => [row.key, row]));

        for (const row of PLAN_PRODUCT_SEED) {
            const existing = existingByKey.get(row.key);
            if (existing) {
                existing.name = row.name;
                existing.sortOrder = row.sortOrder;
                existing.isActive = true;
                continue;
            }
            em.create(PlanProduct, {
                key: row.key,
                name: row.name,
                sortOrder: row.sortOrder,
                isActive: true,
            } as never);
        }
        await em.flush();
    }

    private async seedFeatures(em: EntityManager): Promise<void> {
        const products = await em.find(PlanProduct, {});
        const productByKey = new Map(products.map(product => [product.key, product]));

        const existingRows = await em.find(PlanFeature, {}, { populate: ['product'] });
        const existingByPair = new Map(
            existingRows.map(row => [`${row.product.key}:${row.key}`, row])
        );

        for (const row of PLAN_FEATURE_SEED) {
            const product = productByKey.get(row.productKey);
            if (!product) continue;
            const pair = `${row.productKey}:${row.key}`;
            const existing = existingByPair.get(pair);
            if (existing) {
                existing.name = row.name;
                existing.description = row.description;
                existing.sortOrder = row.sortOrder;
                existing.isActive = true;
                continue;
            }
            em.create(PlanFeature, {
                key: row.key,
                name: row.name,
                description: row.description,
                sortOrder: row.sortOrder,
                isActive: true,
                product,
            } as never);
        }
        await em.flush();
    }

    private async seedCapabilities(em: EntityManager): Promise<void> {
        const features = await em.find(PlanFeature, {}, { populate: ['product'] });
        const featureByCapabilityKey = new Map(
            PLAN_FEATURE_SEED.map(row => {
                const feature = features.find(
                    candidate =>
                        candidate.product.key === row.productKey && candidate.key === row.key
                );
                return [row.capabilityKey, feature] as const;
            }).filter((entry): entry is readonly [CapabilityKey, PlanFeature] => Boolean(entry[1]))
        );

        const keys = CAPABILITY_SEED.map(row => row.key);
        const existingRows = await em.find(Capability, { key: { $in: keys } });
        const existingByKey = new Map(existingRows.map(row => [row.key, row]));

        for (const row of CAPABILITY_SEED) {
            const feature = featureByCapabilityKey.get(row.key);
            if (!feature) continue;
            const existing = existingByKey.get(row.key);
            if (existing) {
                existing.name = row.name;
                existing.description = row.description;
                existing.kind = row.kind;
                existing.sortOrder = row.sortOrder;
                existing.isActive = true;
                existing.feature = feature;
                continue;
            }
            em.create(Capability, {
                key: row.key,
                name: row.name,
                description: row.description,
                kind: row.kind,
                sortOrder: row.sortOrder,
                isActive: true,
                feature,
            } as never);
        }
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
