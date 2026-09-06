import { Entity, Property, Unique } from '@mikro-orm/core';

/**
 * better-auth organization plugin table, stored as `auth.household`.
 *
 * The plugin API still says "organization"; we map `modelName: 'household'`
 * so the database and our code speak Rumbelo. Finance settings hang off this
 * id in `auth.household_settings`.
 *
 *   id    = householdId (UUID from PostgreSQL — generateId: false)
 *   slug  = unique human-readable handle (not used for API scoping)
 *   name  = display label for the household
 *
 * @see https://www.better-auth.com/docs/plugins/organization#customizing-the-schema
 */
@Entity({ tableName: 'household', schema: 'auth' })
@Unique({ properties: ['slug'] })
export class AuthHousehold {
    @Property({ type: 'text', primary: true })
    id!: string;

    @Property({ type: 'text' })
    name!: string;

    @Property({ type: 'text' })
    slug!: string;

    @Property({ type: 'text', nullable: true })
    logo?: string;

    @Property({ type: 'timestamptz' })
    createdAt!: Date;

    @Property({ type: 'text', nullable: true })
    metadata?: string;
}
