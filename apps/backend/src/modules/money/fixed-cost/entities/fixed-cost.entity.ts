import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../common/database/base.entity.js';
import { Cadence, FlowDirection } from '../../../../common/database/enums.js';
import { Category, Jar } from '../../jar/entities/index.js';

/** Recurring obligations. They draw from a jar so they are visible before they hit. */
@Entity({ tableName: 'fixed_cost', schema: 'money' })
export class FixedCost extends HouseholdEntity {
  @ManyToOne(() => Jar)
  jar!: Jar;

  @ManyToOne(() => Category, { nullable: true })
  category: Category | null = null;

  @Property({ length: 120 })
  name!: string;

  @Property({ type: 'bigint' })
  amount!: number;

  @Enum(() => Cadence)
  cadence: Cadence = Cadence.MONTHLY;

  @Property({ nullable: true })
  dueDay: number | null = null;

  @Enum(() => FlowDirection)
  direction: FlowDirection = FlowDirection.OUT;

  @Property({ default: true })
  active = true;

  @Property({ type: 'date', nullable: true })
  endsOn: string | null = null;

  @Property({ type: 'text', nullable: true })
  note: string | null = null;
}
