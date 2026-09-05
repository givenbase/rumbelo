import { Entity, Index, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../../common/database/base.entity';
import { entityConfig } from '../../../../../common/database/entity-config.util';

/**
 * Gratitude Entity
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'public', domain: 'soul', tableName: 'gratitude' }))
@Index({ properties: ['householdId', 'week'] })
export class Gratitude extends HouseholdEntity {
    // ? PROPERTIES
    @Property({ type: 'varchar', length: 64 })
    userId!: string;

    @Property({ length: 8 })
    week!: string;

    @Property({ length: 280 })
    text!: string;
}
