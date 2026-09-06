import { Migration } from '@mikro-orm/migrations';

/**
 * Move board prefs with the auth/household module:
 *   public.platform_household_settings → auth.household_settings
 *
 * Postgres enum types stay in `public` (platform_*, backoffice_*); only the
 * table schema/name change. Matches auth.account_settings naming.
 */
export class Migration20260906103000_MoveHouseholdSettingsToAuth extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `alter table "public"."platform_household_settings" set schema "auth";`
        );
        this.addSql(
            `alter table "auth"."platform_household_settings" rename to "household_settings";`
        );
        this.addSql(
            `alter table "auth"."household_settings" rename constraint "platform_household_settings_pkey" to "household_settings_pkey";`
        );
    }

    override async down(): Promise<void> {
        this.addSql(
            `alter table "auth"."household_settings" rename constraint "household_settings_pkey" to "platform_household_settings_pkey";`
        );
        this.addSql(
            `alter table "auth"."household_settings" rename to "platform_household_settings";`
        );
        this.addSql(
            `alter table "auth"."platform_household_settings" set schema "public";`
        );
    }
}
