import { Entity, Enum, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../common/database/base.entity.js';

export enum AccountKind {
  CHECKING = 'CHECKING', SAVINGS = 'SAVINGS', CREDIT = 'CREDIT',
  CASH = 'CASH', INVESTMENT = 'INVESTMENT',
}

@Entity({ tableName: 'bank_account', schema: 'money' })
export class BankAccount extends HouseholdEntity {
  @Property({ length: 120 })
  name!: string;

  @Property({ length: 34, nullable: true })
  iban: string | null = null;

  @Enum(() => AccountKind)
  kind: AccountKind = AccountKind.CHECKING;

  @Property({ type: 'bigint', default: 0 })
  balance = 0;

  /** Null for manual accounts; set when linked through the bank-sync port. */
  @Property({ type: 'uuid', nullable: true })
  connectionId: string | null = null;

  @Property({ type: 'timestamptz', nullable: true })
  lastSyncedAt: Date | null = null;
}
