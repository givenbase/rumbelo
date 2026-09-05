import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { Currency, HouseholdKind, IncomeRhythm, PlanKey, PayoffStrategy } from '@rumbelo/contracts';

import { entityConfig } from '../../../../common/database/entity-config.util';
import { NativeEnum } from '../../../../common/database/native-enum.util';

/**
 * Money-board prefs for a household. Language, appearance, and money character
 * live on auth.account_settings (person-scoped). Currency and board money style
 * stay here — one accounting currency and one debt order for every member.
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'public', domain: 'platform', tableName: 'household_settings' }))
export class HouseholdSettings {
    // ? PROPERTIES
    @PrimaryKey({ type: 'varchar', length: 64 })
    householdId!: string;

    /** The user's stated reason, surfaced on the dashboard as the "why" line. */
    @Property({ type: 'text', nullable: true })
    why: string | null = null;

    /** Budget rollover day. 1 for most people, 25 for salary-day budgeters. */
    @Property({ default: 1 })
    periodStartDay = 1;

    /** ISO weekday, 1 = Monday. Sunday evening is the product's default ritual slot. */
    @Property({ nullable: true })
    ritualReminderDay: number | null = 7;

    @Property({ length: 5, nullable: true })
    ritualReminderAt: string | null = '19:00';

    @Property({ default: false })
    isBankSyncEnabled = false;

    @Property({ default: true })
    isCoachEnabled = true;

    @Property({ type: 'timestamptz', defaultRaw: 'now()' })
    createdAt: Date = new Date();

    @Property({ type: 'timestamptz', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    // ? ENUMS
    @Enum(NativeEnum({ PlanKey, domain: 'backoffice', defaultValue: PlanKey.BASIC }))
    planKey: PlanKey = PlanKey.BASIC;

    @Enum(NativeEnum({ HouseholdKind, domain: 'platform', defaultValue: HouseholdKind.SOLO }))
    kind: HouseholdKind = HouseholdKind.SOLO;

    @Enum(NativeEnum({ Currency, domain: 'platform', defaultValue: Currency.EUR }))
    currency: Currency = Currency.EUR;

    /** Avalanche / snowball — one order for the shared debt list. */
    @Enum(
        NativeEnum({
            PayoffStrategy,
            domain: 'money',
            defaultValue: PayoffStrategy.AVALANCHE,
        })
    )
    payoffStrategy: PayoffStrategy = PayoffStrategy.AVALANCHE;

    /** Stable vs variable household income picture. */
    @Enum(
        NativeEnum({
            IncomeRhythm,
            domain: 'platform',
            defaultValue: IncomeRhythm.STABLE,
        })
    )
    incomeRhythm: IncomeRhythm = IncomeRhythm.STABLE;
}
