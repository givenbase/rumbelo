import { Migration } from '@mikro-orm/migrations';

/**
 * Person UI prefs (theme, locale) move to auth.account_settings.
 * Household keeps currency and money-board fields only.
 */
export class Migration20260904171822_account_settings extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `create table "auth"."account_settings" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "locale" text check ("locale" in ('nl', 'en')) not null default 'nl', "theme" text check ("theme" in ('light', 'dark', 'system')) not null default 'system', "account_id" uuid not null, constraint "account_settings_pkey" primary key ("id"));`
        );
        this.addSql(
            `alter table "auth"."account_settings" add constraint "account_settings_account_id_unique" unique ("account_id");`
        );
        this.addSql(
            `alter table "auth"."account_settings" add constraint "account_settings_account_id_foreign" foreign key ("account_id") references "auth"."account" ("id") on update cascade on delete cascade;`
        );

        this.addSql(
            `alter table "platform"."household_settings" drop column "theme", drop column "locale";`
        );
    }

    override async down(): Promise<void> {
        this.addSql(`drop table if exists "auth"."account_settings" cascade;`);

        this.addSql(
            `alter table "platform"."household_settings" add column "theme" text check ("theme" in ('light', 'dark', 'system')) not null default 'system', add column "locale" text check ("locale" in ('nl', 'en')) not null default 'nl';`
        );
    }
}
