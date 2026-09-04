import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';

import { AuthUser } from '../user/auth-user.entity';

/**
 * better-auth `session` table — active sign-ins.
 * Written by better-auth (single writer).
 */
@Entity({ tableName: 'session', schema: 'auth' })
@Unique({ properties: ['token'] })
export class AuthSession {
    @Property({ type: 'text', primary: true })
    id!: string;

    @Property({ type: 'timestamptz' })
    expiresAt!: Date;

    @Property({ type: 'text' })
    token!: string;

    @Property({ type: 'timestamptz', defaultRaw: 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Property({ type: 'timestamptz' })
    updatedAt!: Date;

    @Property({ type: 'text', nullable: true })
    ipAddress?: string;

    @Property({ type: 'text', nullable: true })
    userAgent?: string;

    @ManyToOne(() => AuthUser, { deleteRule: 'cascade' })
    user!: AuthUser;

    /** The household this session acts in — set by the organization plugin. */
    @Property({ type: 'text', nullable: true })
    activeOrganizationId?: string;
}
