import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import type { AccountSettings as AccountSettingsDto } from '@rumbelo/contracts';

import { Locale, MoneyCharacter, Theme } from '@rumbelo/contracts';
import { currentUserId } from '../../../../common/household/household.context';
import { Account } from '../account.entity';
import { AccountSettings } from './account-settings.entity';

export type AccountSettingsPatch = {
    locale?: Locale;
    theme?: Theme;
    moneyCharacter?: MoneyCharacter;
};

/**
 * Account Settings Service
 *
 * CRUD for person-scoped UI prefs. The authenticated user's settings are the
 * usual surface; create/ensure is used by onboarding so language lands here,
 * not on the household board.
 */
@Injectable()
export class AccountSettingsService {
    private readonly logger = new Logger(AccountSettingsService.name);

    constructor(@Inject(EntityManager) private readonly em: EntityManager) {}

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    /**
     * Create settings for the current user (and the Account row if missing).
     * Fails if settings already exist — use update or upsert instead.
     */
    async create(patch: AccountSettingsPatch = {}): Promise<AccountSettingsDto> {
        const userId = currentUserId();
        const existing = await this.findEntityByUserId(userId);
        if (existing) {
            throw new Error(`Account settings for user ${userId} already exist`);
        }
        const row = await this.createForUser(userId, patch);
        return toDto(row);
    }

    /**
     * Ensure settings exist for a user (onboarding / lazy get). Idempotent.
     */
    async upsertForUser(
        userId: string,
        defaults: AccountSettingsPatch = {}
    ): Promise<AccountSettings> {
        const existing = await this.findEntityByUserId(userId);
        if (existing) {
            if (defaults.locale !== undefined) existing.locale = defaults.locale;
            if (defaults.theme !== undefined) existing.theme = defaults.theme;
            if (defaults.moneyCharacter !== undefined) {
                existing.moneyCharacter = defaults.moneyCharacter;
            }
            await this.em.flush();
            return existing;
        }
        return this.createForUser(userId, defaults);
    }

    /**
     * Mark personal onboarding complete (idempotent). Used by household.onboard
     * for the creator; invitees can get a lighter personal pass later.
     */
    async markOnboarded(userId: string): Promise<AccountSettings> {
        const row = await this.upsertForUser(userId);
        if (!row.onboardedAt) {
            row.onboardedAt = new Date();
            await this.em.flush();
        }
        return row;
    }

    /**
     * Clear personal onboarded flag (dev / reset flow).
     */
    async clearOnboarded(userId: string): Promise<AccountSettings> {
        const row = await this.upsertForUser(userId);
        row.onboardedAt = null;
        await this.em.flush();
        return row;
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /**
     * Current authenticated user's settings (creates defaults if missing).
     */
    async get(): Promise<AccountSettingsDto> {
        const row = await this.upsertForUser(currentUserId());
        return toDto(row);
    }

    async findOne(id: string): Promise<AccountSettingsDto> {
        const row = await this.em.findOne(AccountSettings, { id }, { populate: ['account'] });
        if (!row) throw new NotFoundException(`Account settings ${id} not found`);
        return toDto(row);
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    /**
     * Patch the current authenticated user's settings.
     */
    async update(patch: AccountSettingsPatch): Promise<AccountSettingsDto> {
        const row = await this.upsertForUser(currentUserId());
        if (patch.locale !== undefined) row.locale = patch.locale;
        if (patch.theme !== undefined) row.theme = patch.theme;
        if (patch.moneyCharacter !== undefined) row.moneyCharacter = patch.moneyCharacter;
        await this.em.flush();
        this.logger.debug(`Updated account settings ${row.id}`);
        return toDto(row);
    }

    // ====================================================================
    // ? DELETE Operations
    // ====================================================================

    /**
     * Delete settings by id. The Account row is left intact.
     */
    async delete(id: string): Promise<{ ok: true }> {
        const row = await this.em.findOne(AccountSettings, { id });
        if (!row) throw new NotFoundException(`Account settings ${id} not found`);
        await this.em.remove(row).flush();
        return { ok: true };
    }

    // ====================================================================
    // Private
    // ====================================================================

    private async findEntityByUserId(userId: string): Promise<AccountSettings | null> {
        const account = await this.em.findOne(
            Account,
            { user: userId },
            { populate: ['settings'] }
        );
        return account?.settings ?? null;
    }

    private async createForUser(
        userId: string,
        defaults: AccountSettingsPatch
    ): Promise<AccountSettings> {
        let account = await this.em.findOne(Account, { user: userId });
        if (!account) {
            account = this.em.create(Account, { user: userId } as never);
            this.em.persist(account);
        }

        const settings = this.em.create(AccountSettings, {
            account,
            locale: defaults.locale ?? Locale.NL,
            theme: defaults.theme ?? Theme.SYSTEM,
            moneyCharacter: defaults.moneyCharacter ?? MoneyCharacter.UNKNOWN,
        } as never);
        await this.em.persist(settings).flush();
        return settings;
    }
}

function toDto(row: AccountSettings): AccountSettingsDto {
    return {
        accountId: row.account.id,
        locale: row.locale,
        theme: row.theme,
        moneyCharacter: row.moneyCharacter,
        onboardedAt: row.onboardedAt ? row.onboardedAt.toISOString() : null,
    };
}
