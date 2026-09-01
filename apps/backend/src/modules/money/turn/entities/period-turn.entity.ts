import { Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';
import { HouseholdEntity } from '../../../../common/database/base.entity.js';
import type { TurnEvent } from './turn-event.entity.js';

/**
 * One period (month) is one Monopoly turn. Closing is irreversible by design —
 * the log is the user's honest history, not a scoreboard to replay.
 */
@Entity({ tableName: 'period_turn', schema: 'money' })
@Unique({ properties: ['householdId', 'period'] })
export class PeriodTurn extends HouseholdEntity {
  /** YYYY-MM */
  @Property({ length: 7 })
  period!: string;

  @Property({ default: 0 })
  score = 0;

  @Property({ default: 0 })
  maxScore = 0;

  @Property({ default: 1 })
  level = 1;

  @Property({ default: false })
  closed = false;

  @Property({ type: 'timestamptz', nullable: true })
  closedAt: Date | null = null;

  @OneToMany('TurnEvent', 'turn')
  events = new Collection<TurnEvent>(this);
}
