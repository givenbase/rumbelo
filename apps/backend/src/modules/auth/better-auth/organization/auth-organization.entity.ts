import { Entity, Property, Unique } from '@mikro-orm/core';

/**
 * better-auth `organization` table — this IS the household.
 *
 * Written by better-auth's organization plugin (single writer); read here for
 * typed household lookups. Finance-specific settings hang off this id in
 * platform.household_settings.
 */
@Entity({ tableName: 'organization', schema: 'auth' })
@Unique({ properties: ['slug'] })
export class AuthOrganization {
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
