import { Collection, Entity, Enum, OneToMany, Property, Unique } from '@mikro-orm/core';

import type { Category } from './category.entity';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { entityConfig } from '../../../../../../common/database/entity-config.util';

export enum JarKey {
    NECESSITIES = 'NECESSITIES',
    FINANCIAL_FREEDOM = 'FINANCIAL_FREEDOM',
    EDUCATION = 'EDUCATION',
    LONG_TERM_SAVINGS = 'LONG_TERM_SAVINGS',
    PLAY = 'PLAY',
    GIVE = 'GIVE',
}

/**
 * Jar Entity
 *
 * Household-owned jar instance. Display defaults come from
 * backoffice.jar_template at onboard; the household may rename / re-split after.
 *
 * @see JarTemplate
 */
@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'jar' }))
@Unique({ properties: ['householdId', 'key'] })
export class Jar extends HouseholdEntity {
    // ? PROPERTIES

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

    // ? RELATIONSHIPS

    @OneToMany('Category', 'jar')
    categories = new Collection<Category>(this);
}
