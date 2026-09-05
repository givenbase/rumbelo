import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { Cadence, FlowDirection } from '@rumbelo/contracts';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { NativeEnum } from '../../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../../common/database/entity-config.util';
import { Category } from '../jar/category.entity';
import { Jar } from '../jar/jar.entity';

/** Recurring obligations. They draw from a jar so they are visible before they hit. */
@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'fixed_cost' }))
export class FixedCost extends HouseholdEntity {
    @ManyToOne(() => Jar)
    jar!: Jar;

    @ManyToOne(() => Category, { nullable: true })
    category: Category | null = null;

    @Property({ length: 120 })
    name!: string;

    @Property({ type: 'bigint' })
    amount!: number;

    @Enum(NativeEnum({ Cadence, domain: 'money', defaultValue: Cadence.MONTHLY }))
    cadence: Cadence = Cadence.MONTHLY;

    @Property({ nullable: true })
    dueDay: number | null = null;

    @Enum(NativeEnum({ FlowDirection, domain: 'money', defaultValue: FlowDirection.OUT }))
    direction: FlowDirection = FlowDirection.OUT;

    @Property({ default: true })
    active = true;

    @Property({ type: 'date', nullable: true })
    endsOn: string | null = null;

    @Property({ type: 'text', nullable: true })
    note: string | null = null;
}
