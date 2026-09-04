import { Entity, Enum, OneToOne } from '@mikro-orm/core';

import { BaseEntity } from '../../../../common/database/base.entity';
import { entityConfig } from '../../../../common/database/entity-config.util';
import { Locale, Theme } from '../../../../common/database/enums';
import { Account } from '../account.entity';

/**
 * Account Settings Entity
 *
 * Person-scoped UI prefs — language and appearance. One row per account.
 *
 * Currency stays on platform.household_settings: the board has one accounting
 * currency shared by every member. Theme and locale can differ per person in
 * the same household (partner in EN/dark, you in NL/light).
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'auth', domain: 'account', tableName: 'settings' }))
export class AccountSettings extends BaseEntity {
    // ? PROPERTIES

    /**
     * Preferred language / formatting locale (nl | en).
     */
    @Enum(() => Locale)
    locale: Locale = Locale.nl;

    /**
     * UI appearance preference (light | dark | system).
     */
    @Enum(() => Theme)
    theme: Theme = Theme.system;

    // ? RELATIONSHIPS

    /**
     * Owning account (1:1). Cascades when the account is deleted.
     */
    @OneToOne(() => Account, { owner: true, deleteRule: 'cascade', unique: true })
    account!: Account;
}
