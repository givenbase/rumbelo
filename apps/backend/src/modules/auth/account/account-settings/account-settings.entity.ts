import { Entity, Enum, OneToOne } from '@mikro-orm/core';

import { BaseEntity } from '../../../../common/database/base.entity';
import { Locale, Theme } from '../../../../common/database/enums';
import { Account } from '../account.entity';

/**
 * Person-scoped UI prefs — language and appearance.
 *
 * Currency stays on platform.household_settings: the board has one accounting
 * currency shared by every member. Theme and locale can differ per person in
 * the same household (partner in EN/dark, you in NL/light).
 */
@Entity({ tableName: 'account_settings', schema: 'auth' })
export class AccountSettings extends BaseEntity {
    @OneToOne(() => Account, { owner: true, deleteRule: 'cascade', unique: true })
    account!: Account;

    @Enum(() => Locale)
    locale: Locale = Locale.nl;

    @Enum(() => Theme)
    theme: Theme = Theme.system;
}
