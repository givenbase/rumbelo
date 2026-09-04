import { Migration } from '@mikro-orm/migrations';

/**
 * Create backoffice schema + jar_template catalog table.
 */
export class Migration20260904175112_jar_template extends Migration {
    override async up(): Promise<void> {
        this.addSql(`create schema if not exists "backoffice";`);
        this.addSql(
            `create table "backoffice"."jar_template" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "key" text check ("key" in ('NECESSITIES', 'FINANCIAL_FREEDOM', 'EDUCATION', 'LONG_TERM_SAVINGS', 'PLAY', 'GIVE')) not null, "name" varchar(80) not null, "subtitle" varchar(160) null, "icon" varchar(8) null, "default_percentage" numeric(5,2) not null, "spendable" boolean not null default true, "sort_order" int not null default 0, "active" boolean not null default true, constraint "jar_template_pkey" primary key ("id"));`
        );
        this.addSql(
            `alter table "backoffice"."jar_template" add constraint "jar_template_key_unique" unique ("key");`
        );
    }

    override async down(): Promise<void> {
        this.addSql(`drop table if exists "backoffice"."jar_template" cascade;`);
        this.addSql(`drop schema if exists "backoffice";`);
    }
}
