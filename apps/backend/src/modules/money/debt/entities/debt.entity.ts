import { Entity, Enum, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../common/database/base.entity.js';

export enum DebtKind {
  CREDIT_CARD = 'CREDIT_CARD', LOAN = 'LOAN', STUDENT = 'STUDENT',
  MORTGAGE = 'MORTGAGE', FAMILY = 'FAMILY', OTHER = 'OTHER',
}

/** Avalanche = highest rate first (cheapest). Snowball = smallest balance first. */
export enum PayoffStrategy { AVALANCHE = 'AVALANCHE', SNOWBALL = 'SNOWBALL' }

@Entity({ tableName: 'debt', schema: 'money' })
export class Debt extends HouseholdEntity {
  @Property({ length: 120 })
  name!: string;

  @Enum(() => DebtKind)
  kind: DebtKind = DebtKind.LOAN;

  @Property({ type: 'bigint' })
  balance!: number;

  @Property({ type: 'bigint' })
  originalBalance!: number;

  /** APR as decimal, e.g. 12.90 — it drives projections, so never a float. */
  @Property({ type: 'decimal', precision: 5, scale: 2, default: '0.00' })
  interestRate!: string;

  @Property({ type: 'bigint', default: 0 })
  minimumPayment = 0;

  @Property({ type: 'bigint', default: 0 })
  extraPayment = 0;

  @Property({ nullable: true })
  dueDay: number | null = null;

  @Property({ type: 'date', nullable: true })
  closedOn: string | null = null;
}
