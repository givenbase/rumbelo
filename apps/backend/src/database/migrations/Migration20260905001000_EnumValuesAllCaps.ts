import { Migration } from '@mikro-orm/migrations';

/**
 * Normalize mixed-case enum wire values to ALL_CAPS (Locale, Theme, HouseholdKind, PlanKey).
 * Fresh installs already get ALL_CAPS from InitialSchema; this upgrades existing DBs.
 */
export class Migration20260905001000_EnumValuesAllCaps extends Migration {
    override async up(): Promise<void> {
        // auth.account_settings — locale / theme
        this.addSql(`alter table "auth"."account_settings" drop constraint if exists "account_settings_locale_check";`);
        this.addSql(`alter table "auth"."account_settings" drop constraint if exists "account_settings_theme_check";`);
        this.addSql(`update "auth"."account_settings" set "locale" = upper("locale");`);
        this.addSql(`update "auth"."account_settings" set "theme" = upper("theme");`);
        this.addSql(`alter table "auth"."account_settings" alter column "locale" set default 'NL';`);
        this.addSql(`alter table "auth"."account_settings" alter column "theme" set default 'SYSTEM';`);
        this.addSql(
            `alter table "auth"."account_settings" add constraint "account_settings_locale_check" check ("locale" in ('NL', 'EN'));`
        );
        this.addSql(
            `alter table "auth"."account_settings" add constraint "account_settings_theme_check" check ("theme" in ('LIGHT', 'DARK', 'SYSTEM'));`
        );

        // platform_household_settings — kind
        this.addSql(
            `alter table "platform_household_settings" drop constraint if exists "platform_household_settings_kind_check";`
        );
        this.addSql(`update "platform_household_settings" set "kind" = upper("kind");`);
        this.addSql(`alter table "platform_household_settings" alter column "kind" set default 'SOLO';`);
        this.addSql(
            `alter table "platform_household_settings" add constraint "platform_household_settings_kind_check" check ("kind" in ('FAMILY', 'PARTNERS', 'FRIENDS', 'SOLO'));`
        );

        // backoffice.plan — key
        this.addSql(`alter table "backoffice"."plan" drop constraint if exists "plan_key_check";`);
        this.addSql(`update "backoffice"."plan" set "key" = upper("key");`);
        this.addSql(
            `alter table "backoffice"."plan" add constraint "plan_key_check" check ("key" in ('GRIP', 'RITME', 'GROEI'));`
        );
    }

    override async down(): Promise<void> {
        this.addSql(`alter table "auth"."account_settings" drop constraint if exists "account_settings_locale_check";`);
        this.addSql(`alter table "auth"."account_settings" drop constraint if exists "account_settings_theme_check";`);
        this.addSql(`update "auth"."account_settings" set "locale" = lower("locale");`);
        this.addSql(`update "auth"."account_settings" set "theme" = lower("theme");`);
        this.addSql(`alter table "auth"."account_settings" alter column "locale" set default 'nl';`);
        this.addSql(`alter table "auth"."account_settings" alter column "theme" set default 'system';`);
        this.addSql(
            `alter table "auth"."account_settings" add constraint "account_settings_locale_check" check ("locale" in ('nl', 'en'));`
        );
        this.addSql(
            `alter table "auth"."account_settings" add constraint "account_settings_theme_check" check ("theme" in ('light', 'dark', 'system'));`
        );

        this.addSql(
            `alter table "platform_household_settings" drop constraint if exists "platform_household_settings_kind_check";`
        );
        this.addSql(`update "platform_household_settings" set "kind" = lower("kind");`);
        this.addSql(`alter table "platform_household_settings" alter column "kind" set default 'solo';`);
        this.addSql(
            `alter table "platform_household_settings" add constraint "platform_household_settings_kind_check" check ("kind" in ('family', 'partners', 'friends', 'solo'));`
        );

        this.addSql(`alter table "backoffice"."plan" drop constraint if exists "plan_key_check";`);
        this.addSql(`update "backoffice"."plan" set "key" = lower("key");`);
        this.addSql(
            `alter table "backoffice"."plan" add constraint "plan_key_check" check ("key" in ('grip', 'ritme', 'groei'));`
        );
    }
}
