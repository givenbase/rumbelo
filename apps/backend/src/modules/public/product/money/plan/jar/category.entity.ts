import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { entityConfig } from '../../../../../../common/database/entity-config.util';
import { Jar } from './jar.entity';

/**
 * A spending line inside a jar. Budget is planned; actuals come from transactions.
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
