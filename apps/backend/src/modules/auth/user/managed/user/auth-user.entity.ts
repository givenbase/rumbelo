import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

/**
 * better-auth `user` table — auth credentials and identity only.
 *
 * Written by better-auth (single writer). `id` is Postgres uuid
 * (`generateId` → uuidv7). `name` is the **display name**.
 * Legal names, DOB, and address live on application `auth.account`.
 */
@Entity({ tableName: 'user', schema: 'auth' })
@Unique({ properties: ['email'] })
export class AuthUser {
    @PrimaryKey({ type: 'uuid' })
    id!: string;

    /** Display name — how Rumbelo greets the person (not legal first/last). */
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
