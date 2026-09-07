import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../../../common/database/household.entity';
import { entityConfig } from '../../../../../../common/database/entity-config.util';
import { IncomeSource } from './income-source.entity';

/**
 * Dated amount for an income source — raises / cuts without overwriting history.
 *
 * @see https://mikro-orm.io/docs/defining-entities
 * @see IncomeSource.amount — cached current (latest period)
 */
@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'income_amount_period' }))
export class IncomeAmountPeriod extends HouseholdEntity {
    // ? PROPERTIES
    @Property({ type: 'bigint' })
    amount!: number;

    @Property({ type: 'date' })
    effectiveOn!: string;

    // ? RELATIONSHIPS
    @ManyToOne(() => IncomeSource, { deleteRule: 'cascade' })
    incomeSource!: IncomeSource;
}
