import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { DemoHouseholdSeeder } from './DemoHouseholdSeeder';
import { JarTemplateSeeder } from './JarTemplateSeeder';
import { PlanSeeder } from './PlanSeeder';

/**
 * Root seeder — runs catalog seeders first, then demo data.
 *
 *   JarTemplateSeeder     jar catalog (we own)
 *   PlanSeeder            product tiers (we own)
 *   DemoHouseholdSeeder   sample household jars (copies jar catalog)
 */
export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        return this.call(em, [JarTemplateSeeder, PlanSeeder, DemoHouseholdSeeder]);
    }
}
