import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { AuthOrganization } from '../organization/auth-organization.entity';
import { AuthUser } from '../user/auth-user.entity';

/**
 * better-auth `invitation` table — pending invites into a household.
 * Written by better-auth's organization plugin (single writer).
 */
@Entity({ tableName: 'invitation', schema: 'auth' })
export class AuthInvitation {
    @Property({ type: 'text', primary: true })
    id!: string;

    @ManyToOne(() => AuthOrganization, { deleteRule: 'cascade' })
    organization!: AuthOrganization;

    @Property({ type: 'text' })
    email!: string;

    @Property({ type: 'text', nullable: true })
    role?: string;

    @Property({ type: 'text' })
    status!: string;

    @Property({ type: 'timestamptz' })
    expiresAt!: Date;

    @Property({ type: 'timestamptz', defaultRaw: 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @ManyToOne(() => AuthUser, { deleteRule: 'cascade' })
    inviter!: AuthUser;
}
