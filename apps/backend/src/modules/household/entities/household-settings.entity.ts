import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

import { Currency, Locale, Theme } from '../../../common/database/enums.js';

/**
 * Finance-specific settings for a household. The household itself — name, members,
 * invitations — lives in better-auth's organization tables, so this row hangs off
 * that id and auth state keeps exactly one writer.
 */
@Entity({ tableName: 'household_settings', schema: 'platform' })
export class HouseholdSettings {
    @PrimaryKey({ type: 'varchar', length: 64 })
    householdId!: string;

    @Enum(() => Theme)
    theme: Theme = Theme.system;

    @Enum(() => Locale)
    locale: Locale = Locale.nl;

    @Enum(() => Currency)
    currency: Currency = Currency.EUR;

    /** Budget rollover day. 1 for most people, 25 for salary-day budgeters. */
    @Property({ default: 1 })
    periodStartDay = 1;

    @Property({ length: 5, nullable: true })
    ritualReminderAt: string | null = '19:00';

    /** ISO weekday, 1 = Monday. Sunday evening is the product's default ritual slot. */
    @Property({ nullable: true })
    ritualReminderDay: number | null = 7;

    @Property({ default: false })
    bankSyncEnabled = false;

    @Property({ default: true })
    coachEnabled = true;

    /** The user's stated reason, surfaced on the dashboard as the "why" line. */
    @Property({ type: 'text', nullable: true })
    why: string | null = null;

    @Property({ type: 'timestamptz', defaultRaw: 'now()' })
    createdAt: Date = new Date();

    @Property({ type: 'timestamptz', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
