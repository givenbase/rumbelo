import { Migration } from '@mikro-orm/migrations';

export class Migration20260826144915 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create schema if not exists "money";`);
    this.addSql(`create schema if not exists "platform";`);
    this.addSql(`create schema if not exists "energy";`);
    this.addSql(`create schema if not exists "soul";`);
    this.addSql(`create schema if not exists "growth";`);
    this.addSql(`create table "money"."bank_account" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "name" varchar(120) not null, "iban" varchar(34) null, "kind" text check ("kind" in ('CHECKING', 'SAVINGS', 'CREDIT', 'CASH', 'INVESTMENT')) not null default 'CHECKING', "balance" bigint not null default 0, "connection_id" uuid null, "last_synced_at" timestamptz null, constraint "bank_account_pkey" primary key ("id"));`);
    this.addSql(`create index "bank_account_household_id_index" on "money"."bank_account" ("household_id");`);

    this.addSql(`create table "platform"."coach_message" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "period" varchar(7) not null, "kind" text check ("kind" in ('NUDGE', 'WIN', 'WARNING', 'INSIGHT', 'RITUAL')) not null default 'NUDGE', "text" text not null, "cta_label" varchar(60) null, "cta_href" varchar(200) null, "dismissed_at" timestamptz null, constraint "coach_message_pkey" primary key ("id"));`);
    this.addSql(`create index "coach_message_household_id_index" on "platform"."coach_message" ("household_id");`);
    this.addSql(`create index "coach_message_household_id_period_index" on "platform"."coach_message" ("household_id", "period");`);

    this.addSql(`create table "money"."debt" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "name" varchar(120) not null, "kind" text check ("kind" in ('CREDIT_CARD', 'LOAN', 'STUDENT', 'MORTGAGE', 'FAMILY', 'OTHER')) not null default 'LOAN', "balance" bigint not null, "original_balance" bigint not null, "interest_rate" numeric(5,2) not null default '0.00', "minimum_payment" bigint not null default 0, "extra_payment" bigint not null default 0, "due_day" varchar(255) null, "closed_on" date null, constraint "debt_pkey" primary key ("id"));`);
    this.addSql(`create index "debt_household_id_index" on "money"."debt" ("household_id");`);

    this.addSql(`create table "energy"."energy_log" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "user_id" uuid not null, "logged_on" date not null, "metric" text check ("metric" in ('SLEEP', 'TRAIN', 'FOOD', 'MIND')) not null, "value" numeric(5,2) not null, "note" varchar(280) null, constraint "energy_log_pkey" primary key ("id"));`);
    this.addSql(`create index "energy_log_household_id_index" on "energy"."energy_log" ("household_id");`);
    this.addSql(`create index "energy_log_household_id_logged_on_index" on "energy"."energy_log" ("household_id", "logged_on");`);
    this.addSql(`alter table "energy"."energy_log" add constraint "energy_log_user_id_logged_on_metric_unique" unique ("user_id", "logged_on", "metric");`);

    this.addSql(`create table "soul"."gratitude" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "user_id" uuid not null, "week" varchar(8) not null, "text" varchar(280) not null, constraint "gratitude_pkey" primary key ("id"));`);
    this.addSql(`create index "gratitude_household_id_index" on "soul"."gratitude" ("household_id");`);
    this.addSql(`create index "gratitude_household_id_week_index" on "soul"."gratitude" ("household_id", "week");`);

    this.addSql(`create table "platform"."household_settings" ("household_id" uuid not null, "theme" text check ("theme" in ('light', 'dark', 'system')) not null default 'system', "locale" text check ("locale" in ('nl', 'en')) not null default 'nl', "currency" text check ("currency" in ('EUR', 'USD', 'GBP')) not null default 'EUR', "period_start_day" int not null default 1, "ritual_reminder_at" varchar(5) null default '19:00', "ritual_reminder_day" int null default 7, "bank_sync_enabled" boolean not null default false, "coach_enabled" boolean not null default true, "why" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "household_settings_pkey" primary key ("household_id"));`);

    this.addSql(`create table "growth"."income_lever" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "label" varchar(160) not null, "note" text null, "potential_monthly" bigint not null default 0, "done" boolean not null default false, constraint "income_lever_pkey" primary key ("id"));`);
    this.addSql(`create index "income_lever_household_id_index" on "growth"."income_lever" ("household_id");`);

    this.addSql(`create table "growth"."income_milestone" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "label" varchar(160) not null, "target_monthly" bigint not null, "reached_on" date null, constraint "income_milestone_pkey" primary key ("id"));`);
    this.addSql(`create index "income_milestone_household_id_index" on "growth"."income_milestone" ("household_id");`);

    this.addSql(`create table "money"."income_source" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "name" varchar(120) not null, "kind" text check ("kind" in ('SALARY', 'FREELANCE', 'BENEFIT', 'RENTAL', 'DIVIDEND', 'OTHER')) not null default 'SALARY', "amount" bigint not null, "cadence" text check ("cadence" in ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'ONCE')) not null default 'MONTHLY', "expected_day" varchar(255) null, "active" boolean not null default true, "started_on" date null, constraint "income_source_pkey" primary key ("id"));`);
    this.addSql(`create index "income_source_household_id_index" on "money"."income_source" ("household_id");`);

    this.addSql(`create table "money"."jar" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "key" text check ("key" in ('NECESSITIES', 'FINANCIAL_FREEDOM', 'EDUCATION', 'LONG_TERM_SAVINGS', 'PLAY', 'GIVE')) not null, "name" varchar(80) not null, "subtitle" varchar(160) null, "icon" varchar(8) null, "percentage" numeric(5,2) not null, "spendable" boolean not null default true, "sort_order" int not null default 0, constraint "jar_pkey" primary key ("id"));`);
    this.addSql(`create index "jar_household_id_index" on "money"."jar" ("household_id");`);
    this.addSql(`alter table "money"."jar" add constraint "jar_household_id_key_unique" unique ("household_id", "key");`);

    this.addSql(`create table "money"."goal" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "jar_id" uuid null, "name" varchar(120) not null, "icon" varchar(8) null, "target" bigint not null, "saved" bigint not null default 0, "monthly_contribution" bigint not null default 0, "target_date" date null, "status" text check ("status" in ('ACTIVE', 'REACHED', 'PAUSED', 'ARCHIVED')) not null default 'ACTIVE', "why" text null, constraint "goal_pkey" primary key ("id"));`);
    this.addSql(`create index "goal_household_id_index" on "money"."goal" ("household_id");`);

    this.addSql(`create table "money"."category" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "jar_id" uuid not null, "name" varchar(80) not null, "budgeted" bigint not null default 0, "archived" boolean not null default false, constraint "category_pkey" primary key ("id"));`);
    this.addSql(`create index "category_household_id_index" on "money"."category" ("household_id");`);

    this.addSql(`create table "money"."fixed_cost" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "jar_id" uuid not null, "category_id" uuid null, "name" varchar(120) not null, "amount" bigint not null, "cadence" text check ("cadence" in ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'ONCE')) not null default 'MONTHLY', "due_day" varchar(255) null, "direction" text check ("direction" in ('IN', 'OUT')) not null default 'OUT', "active" boolean not null default true, "ends_on" date null, "note" text null, constraint "fixed_cost_pkey" primary key ("id"));`);
    this.addSql(`create index "fixed_cost_household_id_index" on "money"."fixed_cost" ("household_id");`);

    this.addSql(`create table "money"."period_turn" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "period" varchar(7) not null, "score" int not null default 0, "max_score" int not null default 0, "level" int not null default 1, "closed" boolean not null default false, "closed_at" timestamptz null, constraint "period_turn_pkey" primary key ("id"));`);
    this.addSql(`create index "period_turn_household_id_index" on "money"."period_turn" ("household_id");`);
    this.addSql(`alter table "money"."period_turn" add constraint "period_turn_household_id_period_unique" unique ("household_id", "period");`);

    this.addSql(`create table "money"."rule" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "field" text check ("field" in ('DESCRIPTION', 'COUNTERPARTY', 'AMOUNT')) not null default 'DESCRIPTION', "matcher" text check ("matcher" in ('CONTAINS', 'EQUALS', 'STARTS_WITH', 'REGEX')) not null default 'CONTAINS', "value" varchar(200) not null, "jar_id" uuid not null, "category_id" uuid null, "priority" int not null default 100, "active" boolean not null default true, "hit_count" int not null default 0, constraint "rule_pkey" primary key ("id"));`);
    this.addSql(`create index "rule_household_id_index" on "money"."rule" ("household_id");`);

    this.addSql(`create table "money"."transaction" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "account_id" uuid null, "jar_id" uuid null, "category_id" uuid null, "amount" bigint not null, "booked_on" date not null, "description" varchar(280) not null, "counterparty" varchar(160) null, "status" text check ("status" in ('INBOX', 'SORTED', 'IGNORED')) not null default 'INBOX', "source" text check ("source" in ('MANUAL', 'CSV', 'BANK', 'RECURRING')) not null default 'MANUAL', "applied_rule_id" uuid null, "dedupe_key" varchar(64) null, "note" text null, constraint "transaction_pkey" primary key ("id"));`);
    this.addSql(`create index "transaction_household_id_index" on "money"."transaction" ("household_id");`);
    this.addSql(`create index "transaction_dedupe_key_index" on "money"."transaction" ("dedupe_key");`);
    this.addSql(`create index "transaction_household_id_status_index" on "money"."transaction" ("household_id", "status");`);
    this.addSql(`create index "transaction_household_id_booked_on_index" on "money"."transaction" ("household_id", "booked_on");`);

    this.addSql(`create table "money"."turn_event" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "turn_id" uuid not null, "period" varchar(7) not null, "kind" text check ("kind" in ('JAR_HELD', 'JAR_OVERSPENT', 'INBOX_CLEARED', 'RITUAL_DONE', 'GOAL_REACHED', 'DEBT_CLEARED', 'INCOME_LOGGED', 'STREAK_KEPT')) not null, "day" int not null, "text" varchar(240) not null, "points" int not null default 0, constraint "turn_event_pkey" primary key ("id"));`);
    this.addSql(`create index "turn_event_household_id_index" on "money"."turn_event" ("household_id");`);
    this.addSql(`create index "turn_event_household_id_period_index" on "money"."turn_event" ("household_id", "period");`);

    this.addSql(`create table "money"."weekly_ritual" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "week" varchar(8) not null, "stage" text check ("stage" in ('LOOK', 'REDIRECT', 'INTEND', 'DONE')) not null default 'LOOK', "surplus" bigint not null default 0, "intention" varchar(280) null, "completed_at" timestamptz null, constraint "weekly_ritual_pkey" primary key ("id"));`);
    this.addSql(`create index "weekly_ritual_household_id_index" on "money"."weekly_ritual" ("household_id");`);
    this.addSql(`alter table "money"."weekly_ritual" add constraint "weekly_ritual_household_id_week_unique" unique ("household_id", "week");`);

    this.addSql(`create table "money"."ritual_allocation" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" uuid not null, "ritual_id" uuid not null, "jar_id" uuid not null, "amount" bigint not null, constraint "ritual_allocation_pkey" primary key ("id"));`);
    this.addSql(`create index "ritual_allocation_household_id_index" on "money"."ritual_allocation" ("household_id");`);
    this.addSql(`alter table "money"."ritual_allocation" add constraint "ritual_allocation_ritual_id_jar_id_unique" unique ("ritual_id", "jar_id");`);

    this.addSql(`alter table "money"."goal" add constraint "goal_jar_id_foreign" foreign key ("jar_id") references "money"."jar" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "money"."category" add constraint "category_jar_id_foreign" foreign key ("jar_id") references "money"."jar" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "money"."fixed_cost" add constraint "fixed_cost_jar_id_foreign" foreign key ("jar_id") references "money"."jar" ("id") on update cascade;`);
    this.addSql(`alter table "money"."fixed_cost" add constraint "fixed_cost_category_id_foreign" foreign key ("category_id") references "money"."category" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "money"."rule" add constraint "rule_jar_id_foreign" foreign key ("jar_id") references "money"."jar" ("id") on update cascade;`);
    this.addSql(`alter table "money"."rule" add constraint "rule_category_id_foreign" foreign key ("category_id") references "money"."category" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "money"."transaction" add constraint "transaction_account_id_foreign" foreign key ("account_id") references "money"."bank_account" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "money"."transaction" add constraint "transaction_jar_id_foreign" foreign key ("jar_id") references "money"."jar" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "money"."transaction" add constraint "transaction_category_id_foreign" foreign key ("category_id") references "money"."category" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "money"."turn_event" add constraint "turn_event_turn_id_foreign" foreign key ("turn_id") references "money"."period_turn" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "money"."ritual_allocation" add constraint "ritual_allocation_ritual_id_foreign" foreign key ("ritual_id") references "money"."weekly_ritual" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "money"."ritual_allocation" add constraint "ritual_allocation_jar_id_foreign" foreign key ("jar_id") references "money"."jar" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "money"."transaction" drop constraint "transaction_account_id_foreign";`);

    this.addSql(`alter table "money"."goal" drop constraint "goal_jar_id_foreign";`);

    this.addSql(`alter table "money"."category" drop constraint "category_jar_id_foreign";`);

    this.addSql(`alter table "money"."fixed_cost" drop constraint "fixed_cost_jar_id_foreign";`);

    this.addSql(`alter table "money"."rule" drop constraint "rule_jar_id_foreign";`);

    this.addSql(`alter table "money"."transaction" drop constraint "transaction_jar_id_foreign";`);

    this.addSql(`alter table "money"."ritual_allocation" drop constraint "ritual_allocation_jar_id_foreign";`);

    this.addSql(`alter table "money"."fixed_cost" drop constraint "fixed_cost_category_id_foreign";`);

    this.addSql(`alter table "money"."rule" drop constraint "rule_category_id_foreign";`);

    this.addSql(`alter table "money"."transaction" drop constraint "transaction_category_id_foreign";`);

    this.addSql(`alter table "money"."turn_event" drop constraint "turn_event_turn_id_foreign";`);

    this.addSql(`alter table "money"."ritual_allocation" drop constraint "ritual_allocation_ritual_id_foreign";`);

    this.addSql(`drop table if exists "money"."bank_account" cascade;`);

    this.addSql(`drop table if exists "platform"."coach_message" cascade;`);

    this.addSql(`drop table if exists "money"."debt" cascade;`);

    this.addSql(`drop table if exists "energy"."energy_log" cascade;`);

    this.addSql(`drop table if exists "soul"."gratitude" cascade;`);

    this.addSql(`drop table if exists "platform"."household_settings" cascade;`);

    this.addSql(`drop table if exists "growth"."income_lever" cascade;`);

    this.addSql(`drop table if exists "growth"."income_milestone" cascade;`);

    this.addSql(`drop table if exists "money"."income_source" cascade;`);

    this.addSql(`drop table if exists "money"."jar" cascade;`);

    this.addSql(`drop table if exists "money"."goal" cascade;`);

    this.addSql(`drop table if exists "money"."category" cascade;`);

    this.addSql(`drop table if exists "money"."fixed_cost" cascade;`);

    this.addSql(`drop table if exists "money"."period_turn" cascade;`);

    this.addSql(`drop table if exists "money"."rule" cascade;`);

    this.addSql(`drop table if exists "money"."transaction" cascade;`);

    this.addSql(`drop table if exists "money"."turn_event" cascade;`);

    this.addSql(`drop table if exists "money"."weekly_ritual" cascade;`);

    this.addSql(`drop table if exists "money"."ritual_allocation" cascade;`);

    this.addSql(`drop schema if exists "money";`);
    this.addSql(`drop schema if exists "platform";`);
    this.addSql(`drop schema if exists "energy";`);
    this.addSql(`drop schema if exists "soul";`);
    this.addSql(`drop schema if exists "growth";`);
  }

}
