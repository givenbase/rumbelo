import { Entity, Property, Unique } from '@mikro-orm/core';

/**
 * better-auth `user` table — auth credentials and identity.
 *
 * The table is written by better-auth (single writer); this entity exists so the
 * rest of the backend gets typed, relational reads instead of raw SQL. Column
 * names are snake_case via the field mappings in auth.config.
 */
@Entity({ tableName: 'user', schema: 'auth' })
@Unique({ properties: ['email'] })
export class AuthUser {
    /** better-auth ids are text, not UUID. */
    @Property({ type: 'text', primary: true })
    id!: string;

    @Property({ type: 'text' })
    name!: string;

    @Property({ type: 'text' })
    email!: string;

    @Property({ type: 'boolean' })
    emailVerified!: boolean;

    @Property({ type: 'text', nullable: true })
    image?: string;

    @Property({ type: 'timestamptz', defaultRaw: 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Property({ type: 'timestamptz', defaultRaw: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

    /** Managed by the twoFactor plugin. */
    @Property({ type: 'boolean', nullable: true })
    twoFactorEnabled?: boolean;
}
