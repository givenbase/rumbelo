import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { AuthOrganization } from '../organization/auth-organization.entity';
import { AuthUser } from '../user/auth-user.entity';

/**
 * better-auth `member` table — a user's membership in a household.
 *
 * Written by better-auth's organization plugin (single writer). Read here for
 * role resolution and member listings; the raw role (owner | admin | member |
 * viewer) is mapped to Rumbelo's OWNER | MEMBER | VIEWER at the service layer.
 */
@Entity({ tableName: 'member', schema: 'auth' })
export class AuthMember {
    @Property({ type: 'text', primary: true })
    id!: string;

    @ManyToOne(() => AuthOrganization, { deleteRule: 'cascade' })
    organization!: AuthOrganization;

    @ManyToOne(() => AuthUser, { deleteRule: 'cascade' })
    user!: AuthUser;

    /** Raw better-auth role: owner | admin | member | viewer. */
    @Property({ type: 'text' })
    role!: string;

    @Property({ type: 'timestamptz' })
    createdAt!: Date;
}
