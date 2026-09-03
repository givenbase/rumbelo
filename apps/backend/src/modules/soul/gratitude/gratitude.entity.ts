import { Entity, Index, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../common/database/base.entity.js';

@Entity({ tableName: 'gratitude', schema: 'soul' })
@Index({ properties: ['householdId', 'week'] })
export class Gratitude extends HouseholdEntity {
    @Property({ type: 'varchar', length: 64 })
    userId!: string;

    @Property({ length: 8 })
    week!: string;

    @Property({ length: 280 })
    text!: string;
}
