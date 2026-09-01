import { Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core';
import { HouseholdEntity } from '../../../../common/database/base.entity.js';
import { PeriodTurn } from './period-turn.entity.js';

export enum TurnEventKind {
  JAR_HELD = 'JAR_HELD', JAR_OVERSPENT = 'JAR_OVERSPENT', INBOX_CLEARED = 'INBOX_CLEARED',
  RITUAL_DONE = 'RITUAL_DONE', GOAL_REACHED = 'GOAL_REACHED', DEBT_CLEARED = 'DEBT_CLEARED',
  INCOME_LOGGED = 'INCOME_LOGGED', STREAK_KEPT = 'STREAK_KEPT',
}

@Entity({ tableName: 'turn_event', schema: 'money' })
@Index({ properties: ['householdId', 'period'] })
export class TurnEvent extends HouseholdEntity {
  @ManyToOne(() => PeriodTurn, { deleteRule: 'cascade' })
  turn!: PeriodTurn;

  @Property({ length: 7 })
  period!: string;

  @Enum(() => TurnEventKind)
  kind!: TurnEventKind;

  @Property()
  day!: number;

  @Property({ length: 240 })
  text!: string;

  @Property({ default: 0 })
  points = 0;
}
