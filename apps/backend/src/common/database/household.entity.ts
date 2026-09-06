import { Property } from '@mikro-orm/core';

import { BaseEntity } from './base.entity';

/**
 * BaseEntity + household isolation — not a second root.
 *
 * ```
 * BaseEntity          id, createdAt, updatedAt
 *   └─ HouseholdEntity  + householdId
 *         └─ Jar, Transaction, Debt, …
 * ```
 *
 * Do **not** confuse with `AuthHousehold` (Better Auth organization plugin table).
 * That is the household **identity** row. This class is for **application data**
 * that belongs to a household.
 *
 * @see common/household — interceptor + HouseholdScopedRepository
 */
export abstract class HouseholdEntity extends BaseEntity {
    /** FK to Better Auth `auth.household.id` (organization plugin). */
    @Property({ type: 'varchar', length: 64, index: true })
    householdId!: string;
}
