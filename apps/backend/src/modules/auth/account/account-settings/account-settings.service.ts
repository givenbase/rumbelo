import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { Locale, Theme } from '../../../../common/database/enums';
import { currentUserId } from '../../../../common/household/household.context';
import { Account } from '../account.entity';
import { AccountSettings } from './account-settings.entity';

@Injectable()
export class AccountSettingsService {
    constructor(private readonly em: EntityManager) {}

    /** Lazy: first settings read creates the account + settings row. */
    async get() {
        const row = await this.ensure();
        return toDto(row);
    }

    async update(patch: { locale?: Locale; theme?: Theme }) {
        const row = await this.ensure();
        if (patch.locale !== undefined) row.locale = patch.locale;
        if (patch.theme !== undefined) row.theme = patch.theme;
        await this.em.flush();
        return toDto(row);
    }

    /**
     * Used by onboarding so the creator's language lands on their account,
     * not on the household board.
     */
    async ensureForUser(userId: string, defaults?: { locale?: Locale; theme?: Theme }) {
        return this.ensure(userId, defaults);
    }

    private async ensure(userId = currentUserId(), defaults?: { locale?: Locale; theme?: Theme }) {
        let account = await this.em.findOne(Account, { user: userId }, { populate: ['settings'] });
        if (!account) {
            account = this.em.create(Account, { user: userId } as never);
            const settings = this.em.create(AccountSettings, {
                account,
                locale: defaults?.locale ?? Locale.nl,
                theme: defaults?.theme ?? Theme.system,
            } as never);
            await this.em.persistAndFlush([account, settings]);
            account.settings = settings;
            return settings;
        }

        if (!account.settings) {
            const settings = this.em.create(AccountSettings, {
                account,
                locale: defaults?.locale ?? Locale.nl,
                theme: defaults?.theme ?? Theme.system,
            } as never);
            await this.em.persistAndFlush(settings);
            account.settings = settings;
            return settings;
        }

        return account.settings;
    }
}

function toDto(row: AccountSettings) {
    return {
        accountId: row.account.id,
        locale: row.locale,
        theme: row.theme,
    };
}
