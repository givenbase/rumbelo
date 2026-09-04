import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { AuthUser } from '../user/auth-user.entity';

/**
 * better-auth `two_factor` table — TOTP secrets and backup codes.
 * Written by better-auth's twoFactor plugin (single writer).
 */
@Entity({ tableName: 'two_factor', schema: 'auth' })
export class AuthTwoFactor {
    @Property({ type: 'text', primary: true })
    id!: string;

    @Property({ type: 'text' })
    secret!: string;

    @Property({ type: 'text' })
    backupCodes!: string;

    @ManyToOne(() => AuthUser, { deleteRule: 'cascade' })
    user!: AuthUser;

    @Property({ type: 'boolean', nullable: true })
    verified?: boolean;

    @Property({ type: 'integer', nullable: true })
    failedVerificationCount?: number;

    @Property({ type: 'timestamptz', nullable: true })
    lockedUntil?: Date;
}
