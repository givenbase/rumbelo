import { Entity, Enum, Property } from '@mikro-orm/core';
import { AccountKind } from '@rumbelo/contracts';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { NativeEnum } from '../../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../../common/database/entity-config.util';

@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'bank_account' }))
export class BankAccount extends HouseholdEntity {
    @Property({ length: 120 })
    name!: string;

    @Property({ length: 34, nullable: true })
    iban: string | null = null;

    @Enum(NativeEnum({ AccountKind, domain: 'money', defaultValue: AccountKind.CHECKING }))
    kind: AccountKind = AccountKind.CHECKING;

    @Property({ type: 'bigint', default: 0 })
    balance = 0;

    /** Null for manual accounts; set when linked through the bank-sync port. */
    @Property({ type: 'uuid', nullable: true })
    connectionId: string | null = null;

    @Property({ type: 'timestamptz', nullable: true })
    lastSyncedAt: Date | null = null;
}
