import { Entity, Enum, OneToOne } from '@mikro-orm/core';
import { Locale, MoneyCharacter, Theme } from '@rumbelo/contracts';

import { BaseEntity } from '../../../../common/database/base.entity';
import { entityConfig } from '../../../../common/database/entity-config.util';
import { NativeEnum } from '../../../../common/database/native-enum.util';
import { Account } from '../account.entity';

/**
 * Account Settings Entity
 *
 * Person-scoped UI prefs — language, appearance, and money character.
 * One row per account.
 *
 * Currency and board debt strategy stay on platform.household_settings.
 * Theme, locale, and money character can differ per person in the same household.
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

    /** Soft spending style — personalises coach tips for who is looking. */
    @Enum(
        NativeEnum({
            MoneyCharacter,
            domain: 'auth',
            defaultValue: MoneyCharacter.UNKNOWN,
        })
    )
    moneyCharacter: MoneyCharacter = MoneyCharacter.UNKNOWN;

    // ? RELATIONSHIPS

    /**
     * Owning account (1:1). Cascades when the account is deleted.
     */
    @OneToOne(() => Account, { owner: true, deleteRule: 'cascade', unique: true })
    account!: Account;
}
