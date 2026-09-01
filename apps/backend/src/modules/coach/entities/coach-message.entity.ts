import { Entity, Enum, Index, Property } from '@mikro-orm/core';
import { HouseholdEntity } from '../../../common/database/base.entity.js';

export enum CoachKind {
  NUDGE = 'NUDGE', WIN = 'WIN', WARNING = 'WARNING', INSIGHT = 'INSIGHT', RITUAL = 'RITUAL',
}

/**
 * The Coach never scolds — "informatie, nooit schaamte". Every message carries
 * exactly one concrete next move, which is why the CTA travels with it.
 */
@Entity({ tableName: 'coach_message', schema: 'platform' })
@Index({ properties: ['householdId', 'period'] })
export class CoachMessage extends HouseholdEntity {
  @Property({ length: 7 })
  period!: string;

  @Enum(() => CoachKind)
  kind: CoachKind = CoachKind.NUDGE;

  @Property({ type: 'text' })
  text!: string;

  @Property({ length: 60, nullable: true })
  ctaLabel: string | null = null;

  @Property({ length: 200, nullable: true })
  ctaHref: string | null = null;

  @Property({ type: 'timestamptz', nullable: true })
  dismissedAt: Date | null = null;
}
