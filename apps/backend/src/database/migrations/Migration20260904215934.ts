import { Migration } from '@mikro-orm/migrations';

/**
 * Backoffice reference catalogs: category templates + money presets.
 * Additive only — does not touch public money_* tables.
 */
export class Migration20260904215934 extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `create table "backoffice"."reference_category_template" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "jar_key" text check ("jar_key" in ('NECESSITIES', 'FINANCIAL_FREEDOM', 'EDUCATION', 'LONG_TERM_SAVINGS', 'PLAY', 'GIVE')) not null, "key" varchar(64) not null, "name" varchar(80) not null, "sort_order" int not null default 0, "active" boolean not null default true, constraint "reference_category_template_pkey" primary key ("id"));`
        );
        this.addSql(
            `alter table "backoffice"."reference_category_template" add constraint "reference_category_template_key_unique" unique ("key");`
        );

        this.addSql(
            `create table "backoffice"."reference_debt_preset" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "key" varchar(64) not null, "name" varchar(120) not null, "kind" text check ("kind" in ('CREDIT_CARD', 'LOAN', 'STUDENT', 'MORTGAGE', 'FAMILY', 'OTHER')) not null, "sort_order" int not null default 0, "active" boolean not null default true, constraint "reference_debt_preset_pkey" primary key ("id"));`
        );
        this.addSql(
            `alter table "backoffice"."reference_debt_preset" add constraint "reference_debt_preset_key_unique" unique ("key");`
        );

        this.addSql(
            `create table "backoffice"."reference_fixed_cost_preset" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "key" varchar(64) not null, "name" varchar(120) not null, "jar_key" text check ("jar_key" in ('NECESSITIES', 'FINANCIAL_FREEDOM', 'EDUCATION', 'LONG_TERM_SAVINGS', 'PLAY', 'GIVE')) not null, "category_template_key" varchar(64) not null, "default_cadence" text check ("default_cadence" in ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'ONCE')) not null default 'MONTHLY', "suggested_due_day" smallint null, "direction" text check ("direction" in ('IN', 'OUT')) not null default 'OUT', "audience_tags" jsonb not null default '[]', "sort_order" int not null default 0, "active" boolean not null default true, constraint "reference_fixed_cost_preset_pkey" primary key ("id"));`
        );
        this.addSql(
            `alter table "backoffice"."reference_fixed_cost_preset" add constraint "reference_fixed_cost_preset_key_unique" unique ("key");`
        );

        this.addSql(
            `create table "backoffice"."reference_goal_preset" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "key" varchar(64) not null, "name" varchar(120) not null, "jar_key" text check ("jar_key" in ('NECESSITIES', 'FINANCIAL_FREEDOM', 'EDUCATION', 'LONG_TERM_SAVINGS', 'PLAY', 'GIVE')) not null, "category_template_key" varchar(64) null, "icon" varchar(8) null, "sort_order" int not null default 0, "active" boolean not null default true, constraint "reference_goal_preset_pkey" primary key ("id"));`
        );
        this.addSql(
            `alter table "backoffice"."reference_goal_preset" add constraint "reference_goal_preset_key_unique" unique ("key");`
        );

        this.addSql(
            `create table "backoffice"."reference_income_source_preset" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "key" varchar(64) not null, "name" varchar(120) not null, "kind" text check ("kind" in ('SALARY', 'FREELANCE', 'BENEFIT', 'RENTAL', 'DIVIDEND', 'OTHER')) not null, "default_cadence" text check ("default_cadence" in ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'ONCE')) not null default 'MONTHLY', "sort_order" int not null default 0, "active" boolean not null default true, constraint "reference_income_source_preset_pkey" primary key ("id"));`
        );
        this.addSql(
            `alter table "backoffice"."reference_income_source_preset" add constraint "reference_income_source_preset_key_unique" unique ("key");`
        );

        this.addSql(
            `create table "backoffice"."reference_merchant_preset" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "key" varchar(64) not null, "name" varchar(120) not null, "match_value" varchar(120) not null, "jar_key" text check ("jar_key" in ('NECESSITIES', 'FINANCIAL_FREEDOM', 'EDUCATION', 'LONG_TERM_SAVINGS', 'PLAY', 'GIVE')) not null, "category_template_key" varchar(64) not null, "sort_order" int not null default 0, "active" boolean not null default true, constraint "reference_merchant_preset_pkey" primary key ("id"));`
        );
        this.addSql(
            `alter table "backoffice"."reference_merchant_preset" add constraint "reference_merchant_preset_key_unique" unique ("key");`
        );
    }

    override async down(): Promise<void> {
        this.addSql(`drop table if exists "backoffice"."reference_merchant_preset" cascade;`);
        this.addSql(`drop table if exists "backoffice"."reference_income_source_preset" cascade;`);
        this.addSql(`drop table if exists "backoffice"."reference_goal_preset" cascade;`);
        this.addSql(`drop table if exists "backoffice"."reference_fixed_cost_preset" cascade;`);
        this.addSql(`drop table if exists "backoffice"."reference_debt_preset" cascade;`);
        this.addSql(`drop table if exists "backoffice"."reference_category_template" cascade;`);
    }
}
