import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { JarTemplate } from '../../modules/backoffice/reference/template/jar/jar.entity';
import { HouseholdSettings } from '../../modules/public/platform/household/household-settings.entity';
import { Jar } from '../../modules/public/product/money/plan/jar/jar.entity';

/** Stable id for local demos — not a real better-auth org until onboard wires auth. */
export const DEMO_HOUSEHOLD_ID = '0195f3a0-0000-7000-8000-000000000001';

/**
 * Seeds one demo household's jars by copying active jar templates.
 * Requires JarTemplateSeeder to have run first.
 */
export class DemoHouseholdSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const existingJars = await em.count(Jar, { householdId: DEMO_HOUSEHOLD_ID });
        if (existingJars > 0) return;

        em.create(HouseholdSettings, {
            householdId: DEMO_HOUSEHOLD_ID,
            why: 'Rust in mijn hoofd, en over vijf jaar een eigen plek.',
        } as never);

        const templates = await em.find(
            JarTemplate,
            { active: true },
            { orderBy: { sortOrder: 'ASC' } }
        );
        if (templates.length === 0) {
            throw new Error('DemoHouseholdSeeder: no jar templates — run JarTemplateSeeder first');
        }

        for (const meta of templates) {
            em.create(Jar, {
                householdId: DEMO_HOUSEHOLD_ID,
                key: meta.key,
                name: meta.name,
                subtitle: meta.subtitle,
                icon: meta.icon,
                percentage: meta.defaultPercentage,
                spendable: meta.spendable,
                sortOrder: meta.sortOrder,
            } as never);
        }

        await em.flush();
    }
}
