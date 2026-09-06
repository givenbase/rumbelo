import { Entity, Property, Unique } from '@mikro-orm/core';

/**
 * better-auth `user` table — auth credentials and identity only.
 *
 * Written by better-auth (single writer). `id` is opaque text minted by BA
 * (not a Postgres uuid). `name` is the **display name**.
 * Legal names, DOB, and address live on application `auth.account`.
 */
@Entity({ tableName: 'user', schema: 'auth' })
@Unique({ properties: ['email'] })
export class AuthUser {
    /** Better Auth opaque text id — not Postgres `uuid`, not Rumbelo `Id`. */
    @Property({ type: 'text', primary: true })
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
