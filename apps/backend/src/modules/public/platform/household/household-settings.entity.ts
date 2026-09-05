import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { Currency, HouseholdKind } from '@rumbelo/contracts';

import { NativeEnum } from '../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../common/database/entity-config.util';

/**
 * Money-board prefs for a household. Language and appearance live on
 * auth.account_settings (person-scoped). Currency stays here — the board has
 * one accounting currency for every member.
 */
@Entity(entityConfig({ schema: 'public', domain: 'platform', tableName: 'household_settings' }))
export class HouseholdSettings {
    @PrimaryKey({ type: 'varchar', length: 64 })
    householdId!: string;

    @Enum(NativeEnum({ HouseholdKind, domain: 'platform', defaultValue: HouseholdKind.SOLO }))
    kind: HouseholdKind = HouseholdKind.SOLO;

    @Enum(NativeEnum({ Currency, domain: 'platform', defaultValue: Currency.EUR }))
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
