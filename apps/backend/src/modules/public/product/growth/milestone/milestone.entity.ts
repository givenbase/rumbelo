import { Entity, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../../common/database/base.entity';
import { entityConfig } from '../../../../../common/database/entity-config.util';

@Entity(entityConfig({ schema: 'public', domain: 'growth', tableName: 'milestone' }))
export class IncomeMilestone extends HouseholdEntity {
    @Property({ length: 160 })
    label!: string;

    @Property({ type: 'bigint' })
    targetMonthly!: number;

    @Property({ type: 'date', nullable: true })
    reachedOn: string | null = null;
}
