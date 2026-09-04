import { Entity, OneToOne } from '@mikro-orm/core';

import type { AccountSettings } from './account-settings/account-settings.entity';

import { BaseEntity } from '../../../common/database/base.entity';
import { AuthUser } from '../better-auth/user/auth-user.entity';

/**
 * Person-scoped data we own — not auth machinery, not household board settings.
 *
 *   better-auth/user                  credentials + identity
 *   auth.account + account_settings   person UI prefs (language, theme)
 *   platform.household_settings       money board (currency, period, ritual, …)
 */
@Entity({ tableName: 'account', schema: 'auth' })
export class Account extends BaseEntity {
    /** The better-auth user this account belongs to (1:1). */
    @OneToOne(() => AuthUser, { deleteRule: 'cascade', unique: true })
    user!: AuthUser;

    /** Inverse of AccountSettings.account — string name avoids ESM circular init. */
    @OneToOne('AccountSettings', { mappedBy: 'account' })
    settings?: AccountSettings;
}
