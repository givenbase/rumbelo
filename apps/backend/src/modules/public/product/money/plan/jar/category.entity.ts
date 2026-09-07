import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../../../common/database/household.entity';
import { entityConfig } from '../../../../../../common/database/entity-config.util';
import { Jar } from './jar.entity';

/**
 * A spending line inside a jar.
 * Stored `budgeted` is a manual envelope; JarBalance.budgeted adds monthly fixed OUT.
 * Actuals on balances come from sorted OUT transactions in the period.
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'category' }))
export class Category extends HouseholdEntity {
    // ? PROPERTIES
    @Property({ length: 80 })
    name!: string;

    @Property({ type: 'bigint', default: 0 })
    budgeted = 0;

    @Property({ default: false })
    isArchived = false;

    // ? RELATIONSHIPS
    @ManyToOne(() => Jar, { deleteRule: 'cascade' })
    jar!: Jar;
}
