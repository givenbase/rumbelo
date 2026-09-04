import { Migration } from '@mikro-orm/migrations';

/**
 * Create backoffice.plan — product tier catalog (Grip / Engine / Compound).
 */
export class Migration20260904181000_plan extends Migration {
    override async up(): Promise<void> {
        this.addSql(`create schema if not exists "backoffice";`);
        this.addSql(
            `create table "backoffice"."plan" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "key" text check ("key" in ('grip', 'ritme', 'groei')) not null, "name" varchar(40) not null, "rank" int not null, "price_monthly" numeric(8,2) not null default 0.00, "unlocks" jsonb not null default '[]', "sort_order" int not null default 0, "active" boolean not null default true, constraint "plan_pkey" primary key ("id"));`
        );
        this.addSql(`alter table "backoffice"."plan" add constraint "plan_key_unique" unique ("key");`);
    }

    override async down(): Promise<void> {
        this.addSql(`drop table if exists "backoffice"."plan" cascade;`);
    }
}
