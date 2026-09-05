import { Entity, Enum, OneToOne } from '@mikro-orm/core';
import { Locale, Theme } from '@rumbelo/contracts';

import { BaseEntity } from '../../../../common/database/base.entity';
import { NativeEnum } from '../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../common/database/entity-config.util';
import { Account } from '../account.entity';

/**
 * Account Settings Entity
 *
 * Person-scoped UI prefs — language and appearance. One row per account.
 *
 * Currency stays on platform.household_settings: the board has one accounting
 * currency shared by every member. Theme and locale can differ per person in
 * the same household (partner in EN/DARK, you in NL/LIGHT).
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'auth', domain: 'account', tableName: 'settings' }))
export class AccountSettings extends BaseEntity {
    // ? PROPERTIES

    /** Preferred language (NL | EN). */
    @Enum(NativeEnum({ Locale, domain: 'auth', defaultValue: Locale.NL }))
    locale: Locale = Locale.NL;

    /** UI appearance preference (LIGHT | DARK | SYSTEM). */
    @Enum(NativeEnum({ Theme, domain: 'auth', defaultValue: Theme.SYSTEM }))
    theme: Theme = Theme.SYSTEM;

    // ? RELATIONSHIPS

    /**
     * Owning account (1:1). Cascades when the account is deleted.
     */
    @OneToOne(() => Account, { owner: true, deleteRule: 'cascade', unique: true })
    account!: Account;
}
