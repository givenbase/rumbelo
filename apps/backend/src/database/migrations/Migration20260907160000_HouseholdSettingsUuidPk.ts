import { Migration } from '@mikro-orm/migrations';

/**
 * HouseholdSettings joins HouseholdEntity: uuid `id` PK + UNIQUE(household_id).
 * Previously PK was Better Auth household_id (HouseholdKeyedEntity) — removed.
 */
export class Migration20260907160000_HouseholdSettingsUuidPk extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            alter table "auth"."household_settings"
                add column if not exists "id" uuid not null default gen_random_uuid();
        `);
        this.addSql(`
            alter table "auth"."household_settings"
                drop constraint if exists "household_settings_pkey";
        `);
        this.addSql(`
            alter table "auth"."household_settings"
                add constraint "household_settings_pkey" primary key ("id");
        `);
        // App mints uuidv7 via BaseEntity — drop DB default after backfill.
        this.addSql(`
            alter table "auth"."household_settings"
                alter column "id" drop default;
        `);
        this.addSql(`
            alter table "auth"."household_settings"
                drop constraint if exists "household_settings_household_id_unique";
        `);
        this.addSql(`
            alter table "auth"."household_settings"
                add constraint "household_settings_household_id_unique" unique ("household_id");
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "auth"."household_settings"
                drop constraint if exists "household_settings_household_id_unique";
        `);
        this.addSql(`
            alter table "auth"."household_settings"
                drop constraint if exists "household_settings_pkey";
        `);
        this.addSql(`
            alter table "auth"."household_settings"
                add constraint "household_settings_pkey" primary key ("household_id");
        `);
        this.addSql(`
            alter table "auth"."household_settings"
                drop column if exists "id";
        `);
    }
}
