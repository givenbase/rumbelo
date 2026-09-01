import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { HouseholdSettings } from '../../modules/household/entities/household-settings.entity.js';
import { DEFAULT_JAR_SPLIT, Jar, JarKey } from '../../modules/money/jar/entities/jar.entity.js';

/** Stable id for local dev — matches nothing in better-auth until onboarding wires auth. */
export const DEMO_HOUSEHOLD_ID = '0195f3a0-0000-7000-8000-000000000001';

const JAR_META: { key: JarKey; name: string; subtitle: string; icon: string; spendable: boolean }[] = [
  { key: JarKey.NECESSITIES, name: 'Necessity', subtitle: 'Must-pays', icon: '🏠', spendable: true },
  { key: JarKey.FINANCIAL_FREEDOM, name: 'Financial Freedom', subtitle: 'Never spend', icon: '🔒', spendable: false },
  { key: JarKey.LONG_TERM_SAVINGS, name: 'Long Term Savings', subtitle: 'Big things', icon: '🎯', spendable: true },
  { key: JarKey.EDUCATION, name: 'Education', subtitle: 'Grow yourself', icon: '📚', spendable: true },
  { key: JarKey.PLAY, name: 'Play', subtitle: 'Guilt-free', icon: '✨', spendable: true },
  { key: JarKey.GIVE, name: 'Give / foundation', subtitle: 'Pass it on', icon: '🤲', spendable: true },
];

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const existing = await em.count(Jar, { householdId: DEMO_HOUSEHOLD_ID });
    if (existing > 0) return;

    em.create(HouseholdSettings, {
      householdId: DEMO_HOUSEHOLD_ID,
      why: 'Rust in mijn hoofd, en over vijf jaar een eigen plek.',
    } as never);

    JAR_META.forEach((meta, sortOrder) => {
      em.create(Jar, {
        householdId: DEMO_HOUSEHOLD_ID,
        key: meta.key,
        name: meta.name,
        subtitle: meta.subtitle,
        icon: meta.icon,
        percentage: DEFAULT_JAR_SPLIT[meta.key].toFixed(2),
        spendable: meta.spendable,
        sortOrder,
      } as never);
    });

    await em.flush();
  }
}
