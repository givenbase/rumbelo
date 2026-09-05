import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { CategoryTemplateSeeder } from './CategoryTemplateSeeder';
import { DebtPresetSeeder } from './DebtPresetSeeder';
import { DemoHouseholdSeeder } from './DemoHouseholdSeeder';
import { FixedCostPresetSeeder } from './FixedCostPresetSeeder';
import { GoalPresetSeeder } from './GoalPresetSeeder';
import { IncomeSourcePresetSeeder } from './IncomeSourcePresetSeeder';
import { JarTemplateSeeder } from './JarTemplateSeeder';
import { MerchantPresetSeeder } from './MerchantPresetSeeder';
import { PlanSeeder } from './PlanSeeder';

/**
 * Root seeder — catalog templates/presets first, then plans, then demo data.
 */
export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        return this.call(em, [
            JarTemplateSeeder,
            CategoryTemplateSeeder,
            FixedCostPresetSeeder,
            DebtPresetSeeder,
            IncomeSourcePresetSeeder,
            GoalPresetSeeder,
            MerchantPresetSeeder,
            PlanSeeder,
            DemoHouseholdSeeder,
        ]);
    }
}
