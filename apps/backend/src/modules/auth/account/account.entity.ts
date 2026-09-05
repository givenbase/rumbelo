import { Entity, OneToOne } from '@mikro-orm/core';

import type { AccountSettings } from './account-settings/account-settings.entity';

import { BaseEntity } from '../../../common/database/base.entity';
import { entityConfig } from '../../../common/database/entity-config.util';
import { AuthUser } from '../better-auth/user/auth-user.entity';

/**
 * Account Entity
 *
 * Rumbelo-owned person row — everything about a human that is NOT auth machinery
 * and NOT household board settings.
 *
 *   better-auth/user                  credentials + identity (email, password, image)
 *   auth.account + account_settings   person UI prefs (language, theme, …)
 *   platform.household_settings       money board (currency, period, ritual, …)
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'auth', tableName: 'account' }))
export class Account extends BaseEntity {
    // ? RELATIONSHIPS
    /**
     * The better-auth user this account belongs to (1:1).
     * Owner side — Account holds the foreign key.
     */
    @OneToOne(() => AuthUser, { deleteRule: 'cascade', unique: true })
    user!: AuthUser;

    /**
     * Inverse of AccountSettings.account.
     * String entity name avoids ESM circular init with TsMorph.
     */
    @OneToOne('AccountSettings', { mappedBy: 'account' })
    settings?: AccountSettings;
}
