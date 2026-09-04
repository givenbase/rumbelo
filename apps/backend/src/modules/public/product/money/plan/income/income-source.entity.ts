import { Entity, Enum, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { entityConfig } from '../../../../../../common/database/entity-config.util';
import { Cadence } from '../../../../../../common/database/enums';

export enum IncomeKind {
    SALARY = 'SALARY',
    FREELANCE = 'FREELANCE',
    BENEFIT = 'BENEFIT',
    RENTAL = 'RENTAL',
    DIVIDEND = 'DIVIDEND',
    OTHER = 'OTHER',
}

@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'income_source' }))
export class IncomeSource extends HouseholdEntity {
    @Property({ length: 120 })
    name!: string;

    @Enum(() => IncomeKind)
    kind: IncomeKind = IncomeKind.SALARY;

    @Property({ type: 'bigint' })
    amount!: number;

    @Enum(() => Cadence)
    cadence: Cadence = Cadence.MONTHLY;

    /** Day of month the money lands; drives the auto-split trigger. */
    @Property({ nullable: true })
    expectedDay: number | null = null;

    @Property({ default: true })
    active = true;

    @Property({ type: 'date', nullable: true })
    startedOn: string | null = null;
}
