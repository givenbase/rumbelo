import { Entity, Enum, Property } from '@mikro-orm/core';
import { Cadence, IncomeKind } from '@rumbelo/contracts';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { NativeEnum } from '../../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../../common/database/entity-config.util';

@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'income_source' }))
export class IncomeSource extends HouseholdEntity {
    @Property({ length: 120 })
    name!: string;

    @Enum(NativeEnum({ IncomeKind, domain: 'money', defaultValue: IncomeKind.SALARY }))
    kind: IncomeKind = IncomeKind.SALARY;

    @Property({ type: 'bigint' })
    amount!: number;

    @Enum(NativeEnum({ Cadence, domain: 'money', defaultValue: Cadence.MONTHLY }))
    cadence: Cadence = Cadence.MONTHLY;

    /** Day of month the money lands; drives the auto-split trigger. */
    @Property({ nullable: true })
    expectedDay: number | null = null;

    @Property({ default: true })
    active = true;

    @Property({ type: 'date', nullable: true })
    startedOn: string | null = null;
}
