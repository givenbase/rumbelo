import { Entity, Enum, Property } from '@mikro-orm/core';
import { Cadence, IncomeKind } from '@rumbelo/contracts';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { NativeEnum } from '../../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../../common/database/entity-config.util';

/**
 * IncomeSource Entity
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'income_source' }))
export class IncomeSource extends HouseholdEntity {
    // ? PROPERTIES
    @Property({ length: 120 })
    name!: string;

    @Property({ type: 'bigint' })
    amount!: number;

    /** Day of month the money lands; drives the auto-split trigger. */
    @Property({ nullable: true })
    expectedDay: number | null = null;

    @Property({ default: true })
    isActive = true;

    @Property({ type: 'date', nullable: true })
    startedOn: string | null = null;

    // ? ENUMS
    @Enum(NativeEnum({ IncomeKind, domain: 'money', defaultValue: IncomeKind.SALARY }))
    kind: IncomeKind = IncomeKind.SALARY;

    @Enum(NativeEnum({ Cadence, domain: 'money', defaultValue: Cadence.MONTHLY }))
    cadence: Cadence = Cadence.MONTHLY;
}
