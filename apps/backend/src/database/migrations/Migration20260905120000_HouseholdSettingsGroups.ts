import { Migration } from '@mikro-orm/migrations';

/**
 * Group household settings into jsonb bags:
 *   money_settings / ritual_settings / feature_settings / answers
 * General identity stays as columns: why, kind, currency, plan_key.
 */
export class Migration20260905120000_HouseholdSettingsGroups extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            alter table "public"."platform_household_settings"
            add column if not exists "money_settings" jsonb not null default '{"periodStartDay":1,"incomeRhythm":"STABLE","payoffStrategy":"AVALANCHE"}'::jsonb,
            add column if not exists "ritual_settings" jsonb not null default '{"reminderDay":7,"reminderAt":"19:00"}'::jsonb,
            add column if not exists "feature_settings" jsonb not null default '{"isBankSyncEnabled":false,"isCoachEnabled":true}'::jsonb,
            add column if not exists "answers" jsonb not null default '{}'::jsonb;
        `);

        this.addSql(`
            update "public"."platform_household_settings"
            set
                "money_settings" = jsonb_build_object(
                    'periodStartDay', coalesce("period_start_day", 1),
                    'incomeRhythm', coalesce("income_rhythm"::text, 'STABLE'),
                    'payoffStrategy', coalesce("payoff_strategy"::text, 'AVALANCHE')
                ),
                "ritual_settings" = jsonb_build_object(
                    'reminderDay', "ritual_reminder_day",
                    'reminderAt', "ritual_reminder_at"
                ),
                "feature_settings" = jsonb_build_object(
                    'isBankSyncEnabled', coalesce("is_bank_sync_enabled", false),
                    'isCoachEnabled', coalesce("is_coach_enabled", true)
                )
            where true;
        `);

        this.addSql(`
            alter table "public"."platform_household_settings"
            drop column if exists "period_start_day",
            drop column if exists "ritual_reminder_day",
            drop column if exists "ritual_reminder_at",
            drop column if exists "is_bank_sync_enabled",
            drop column if exists "is_coach_enabled",
            drop column if exists "payoff_strategy",
            drop column if exists "income_rhythm";
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "public"."platform_household_settings"
            add column if not exists "period_start_day" int not null default 1,
            add column if not exists "ritual_reminder_day" int null default 7,
            add column if not exists "ritual_reminder_at" varchar(5) null default '19:00',
            add column if not exists "is_bank_sync_enabled" boolean not null default false,
            add column if not exists "is_coach_enabled" boolean not null default true,
            add column if not exists "payoff_strategy" "public"."money_payoff_strategy" not null default 'AVALANCHE',
            add column if not exists "income_rhythm" "public"."platform_income_rhythm" not null default 'STABLE';
        `);

        this.addSql(`
            update "public"."platform_household_settings"
            set
                "period_start_day" = coalesce(("money_settings"->>'periodStartDay')::int, 1),
                "income_rhythm" = coalesce(("money_settings"->>'incomeRhythm')::"public"."platform_income_rhythm", 'STABLE'),
                "payoff_strategy" = coalesce(("money_settings"->>'payoffStrategy')::"public"."money_payoff_strategy", 'AVALANCHE'),
                "ritual_reminder_day" = ("ritual_settings"->>'reminderDay')::int,
                "ritual_reminder_at" = "ritual_settings"->>'reminderAt',
                "is_bank_sync_enabled" = coalesce(("feature_settings"->>'isBankSyncEnabled')::boolean, false),
                "is_coach_enabled" = coalesce(("feature_settings"->>'isCoachEnabled')::boolean, true);
        `);

        this.addSql(`
            alter table "public"."platform_household_settings"
            drop column if exists "money_settings",
            drop column if exists "ritual_settings",
            drop column if exists "feature_settings",
            drop column if exists "answers";
        `);
    }
}
