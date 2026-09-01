import { Collection, Entity, Enum, OneToMany, Property, Unique } from '@mikro-orm/core';

import type { RitualAllocation } from './ritual-allocation.entity.js';

import { HouseholdEntity } from '../../../../common/database/base.entity.js';

export enum RitualStage { LOOK = 'LOOK', REDIRECT = 'REDIRECT', INTEND = 'INTEND', DONE = 'DONE' }

/**
 * The ten-minute weekly ritual: look, redirect, set intention. Three steps on
 * purpose — the product's core claim is that this beats worrying daily.
 */
@Entity({ tableName: 'weekly_ritual', schema: 'money' })
@Unique({ properties: ['householdId', 'week'] })
export class WeeklyRitual extends HouseholdEntity {
  /** YYYY-Www */
  @Property({ length: 8 })
  week!: string;

  @Enum(() => RitualStage)
  stage: RitualStage = RitualStage.LOOK;

  @Property({ type: 'bigint', default: 0 })
  surplus = 0;

  @OneToMany('RitualAllocation', 'ritual')
  allocations = new Collection<RitualAllocation>(this);

  @Property({ length: 280, nullable: true })
  intention: string | null = null;

  @Property({ type: 'timestamptz', nullable: true })
  completedAt: Date | null = null;
}
