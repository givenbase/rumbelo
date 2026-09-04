import { Collection, Entity, Enum, OneToMany, Property, Unique } from '@mikro-orm/core';

import type { Category } from './category.entity';

import { HouseholdEntity } from '../../../../common/database/base.entity';

export enum JarKey {
    NECESSITIES = 'NECESSITIES',
    FINANCIAL_FREEDOM = 'FINANCIAL_FREEDOM',
    EDUCATION = 'EDUCATION',
    LONG_TERM_SAVINGS = 'LONG_TERM_SAVINGS',
    PLAY = 'PLAY',
    GIVE = 'GIVE',
}

/** T. Harv Eker's canonical split — the onboarding default, fully user-overridable. */
export const DEFAULT_JAR_SPLIT: Record<JarKey, number> = {
    [JarKey.NECESSITIES]: 55,
    [JarKey.FINANCIAL_FREEDOM]: 10,
    [JarKey.LONG_TERM_SAVINGS]: 10,
    [JarKey.EDUCATION]: 10,
    [JarKey.PLAY]: 10,
    [JarKey.GIVE]: 5,
};

@Entity({ tableName: 'jar', schema: 'money' })
@Unique({ properties: ['householdId', 'key'] })
export class Jar extends HouseholdEntity {
    @Enum(() => JarKey)
    key!: JarKey;

    @Property({ length: 80 })
    name!: string;

    @Property({ length: 160, nullable: true })
    subtitle: string | null = null;

    @Property({ length: 8, nullable: true })
    icon: string | null = null;

    /** Share of net income routed here on arrival. Jars must sum to 100 per household. */
    @Property({ type: 'decimal', precision: 5, scale: 2 })
    percentage!: string;

    /** Financial Freedom is never spent, only invested out. Enforced in JarService. */
    @Property({ default: true })
    spendable = true;

    @Property({ default: 0 })
    sortOrder = 0;

    @OneToMany('Category', 'jar')
    categories = new Collection<Category>(this);
}
