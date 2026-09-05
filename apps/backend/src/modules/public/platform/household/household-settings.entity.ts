import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import {
    Currency,
    HouseholdKind,
    IncomeRhythm,
    PlanKey,
    PayoffStrategy,
    type HouseholdAnswers,
    type HouseholdFeatureSettings,
    type HouseholdMoneySettings,
    type HouseholdRitualSettings,
} from '@rumbelo/contracts';

import { entityConfig } from '../../../../common/database/entity-config.util';
import { NativeEnum } from '../../../../common/database/native-enum.util';

export const DEFAULT_MONEY_SETTINGS: HouseholdMoneySettings = {
    periodStartDay: 1,
    incomeRhythm: IncomeRhythm.STABLE,
    payoffStrategy: PayoffStrategy.AVALANCHE,
};

export const DEFAULT_RITUAL_SETTINGS: HouseholdRitualSettings = {
    reminderDay: 7,
    reminderAt: '19:00',
};

export const DEFAULT_FEATURE_SETTINGS: HouseholdFeatureSettings = {
    isBankSyncEnabled: false,
    isCoachEnabled: true,
};

/**
 * Money-board prefs for a household. Language, appearance, and money character
 * live on auth.account_settings (person-scoped). Currency and board money style
 * stay here — one accounting currency and one debt order for every member.
 *
 * Layout:
 *   - general scalars (why)
 *   - product / board enums (kind, currency, planKey)
 *   - grouped jsonb bags (money*, ritual*, feature*, answers)
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

    /**
     * Money board: period rollover, income rhythm, debt payoff order.
     * Queried via the settings row — not filtered as SQL columns.
     */
    @Property({ type: 'json' })
    moneySettings: HouseholdMoneySettings = { ...DEFAULT_MONEY_SETTINGS };

    /**
     * Ritual reminder slot (weekday + local HH:mm). Null day/at disables.
     */
    @Property({ type: 'json' })
    ritualSettings: HouseholdRitualSettings = { ...DEFAULT_RITUAL_SETTINGS };

    /** Feature toggles for the board (bank sync, coach, …). */
    @Property({ type: 'json' })
    featureSettings: HouseholdFeatureSettings = { ...DEFAULT_FEATURE_SETTINGS };

    /**
     * Extensible household Q&A (onboarding / coach prompts).
     * Keys are stable question ids — grow without new columns.
     */
    @Property({ type: 'json' })
    answers: HouseholdAnswers = {};

    /**
     * When board setup finished (`household.onboard`). Null = incomplete household.
     */
    @Property({ type: 'timestamptz', nullable: true })
    onboardedAt: Date | null = null;

    @Property({ type: 'timestamptz', defaultRaw: 'now()' })
    createdAt: Date = new Date();

    @Property({ type: 'timestamptz', defaultRaw: 'now()', onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    // ? ENUMS
    @Enum(NativeEnum({ HouseholdKind, domain: 'platform', defaultValue: HouseholdKind.SOLO }))
    kind: HouseholdKind = HouseholdKind.SOLO;

    @Enum(NativeEnum({ Currency, domain: 'platform', defaultValue: Currency.EUR }))
    currency: Currency = Currency.EUR;

    @Enum(NativeEnum({ PlanKey, domain: 'backoffice', defaultValue: PlanKey.BASIC }))
    planKey: PlanKey = PlanKey.BASIC;
}
