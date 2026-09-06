import { PrimaryKey, Property } from '@mikro-orm/core';
import { v7 as uuidv7 } from 'uuid';

/**
 * Root for every Rumbelo-owned MikroORM row.
 *
 * Use this directly for rows that are **not** scoped to a household
 * (account profile, backoffice catalogs, templates).
 *
 * Household-scoped product rows extend {@link HouseholdEntity} instead —
 * that class adds only `householdId` on top of this base (no duplicated fields).
 *
 * Better Auth tables (`AuthUser`, `AuthHousehold`, …) do **not** extend this —
 * they keep library-owned opaque text primary keys (not Postgres uuid).
 */
export abstract class BaseEntity {
    /** uuid v7 — time-ordered keys keep btree inserts local. */
    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv7();

    @Property({ type: 'timestamptz', defaultRaw: 'now()' })
    createdAt: Date = new Date();

    @Property({ type: 'timestamptz', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
