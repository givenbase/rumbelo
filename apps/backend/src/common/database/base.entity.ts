import { PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';

/**
 * uuid v7 rather than v4: time-ordered keys keep btree inserts local and make
 * "most recent" queries cheap, which matters for the transaction table.
 */
export abstract class BaseEntity {
    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv7();

    @Property({ type: 'timestamptz', defaultRaw: 'now()' })
    createdAt: Date = new Date();

    @Property({ type: 'timestamptz', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}

/**
 * Every financial row carries the household it belongs to. This is the isolation
 * boundary — single schema, row-level scoping. See common/household for the
 * interceptor + scoped repository that guarantee no query escapes it.
 */
export abstract class HouseholdEntity extends BaseEntity {
    /** better-auth organization id (non-uuid string) */
    @Property({ type: 'varchar', length: 64, index: true })
    householdId!: string;
}
