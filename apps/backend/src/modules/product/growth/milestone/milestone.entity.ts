import { Entity, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../common/database/base.entity';

@Entity({ tableName: 'income_milestone', schema: 'growth' })
export class IncomeMilestone extends HouseholdEntity {
    @Property({ length: 160 })
    label!: string;

    @Property({ type: 'bigint' })
    targetMonthly!: number;

    @Property({ type: 'date', nullable: true })
    reachedOn: string | null = null;
}
