import { Migration } from '@mikro-orm/migrations';

export class Migration20260904203255_InitialSchema extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create schema if not exists "auth";`);
    this.addSql(`create schema if not exists "backoffice";`);
    this.addSql(`create table "auth"."organization" ("id" text not null, "name" text not null, "slug" text not null, "logo" text null, "created_at" timestamptz not null, "metadata" text null, constraint "organization_pkey" primary key ("id"));`);
    this.addSql(`alter table "auth"."organization" add constraint "organization_slug_unique" unique ("slug");`);

    this.addSql(`create table "auth"."user" ("id" text not null, "name" text not null, "email" text not null, "email_verified" boolean not null, "image" text null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "two_factor_enabled" boolean null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "auth"."user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "auth"."two_factor" ("id" text not null, "secret" text not null, "backup_codes" text not null, "user_id" text not null, "verified" boolean null, "failed_verification_count" int null, "locked_until" timestamptz null, constraint "two_factor_pkey" primary key ("id"));`);

    this.addSql(`create table "auth"."session" ("id" text not null, "expires_at" timestamptz not null, "token" text not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null, "ip_address" text null, "user_agent" text null, "user_id" text not null, "active_organization_id" text null, constraint "session_pkey" primary key ("id"));`);
    this.addSql(`alter table "auth"."session" add constraint "session_token_unique" unique ("token");`);

    this.addSql(`create table "auth"."provider" ("id" text not null, "issuer" text not null, "account_id" text not null, "provider_id" text not null, "user_id" text not null, "access_token" text null, "refresh_token" text null, "id_token" text null, "access_token_expires_at" timestamptz null, "refresh_token_expires_at" timestamptz null, "scope" text null, "password" text null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null, constraint "provider_pkey" primary key ("id"));`);

    this.addSql(`create table "auth"."member" ("id" text not null, "organization_id" text not null, "user_id" text not null, "role" text not null, "created_at" timestamptz not null, constraint "member_pkey" primary key ("id"));`);

    this.addSql(`create table "auth"."invitation" ("id" text not null, "organization_id" text not null, "email" text not null, "role" text null, "status" text not null, "expires_at" timestamptz not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "inviter_id" text not null, constraint "invitation_pkey" primary key ("id"));`);

    this.addSql(`create table "auth"."account" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "user_id" text not null, constraint "account_pkey" primary key ("id"));`);
    this.addSql(`alter table "auth"."account" add constraint "account_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "auth"."account_settings" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "locale" text check ("locale" in ('nl', 'en')) not null default 'nl', "theme" text check ("theme" in ('light', 'dark', 'system')) not null default 'system', "account_id" uuid not null, constraint "account_settings_pkey" primary key ("id"));`);
    this.addSql(`alter table "auth"."account_settings" add constraint "account_settings_account_id_unique" unique ("account_id");`);

    this.addSql(`create table "auth"."verification" ("id" text not null, "identifier" text not null, "value" text not null, "expires_at" timestamptz not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, constraint "verification_pkey" primary key ("id"));`);

    this.addSql(`create table "money_bank_account" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "name" varchar(120) not null, "iban" varchar(34) null, "kind" text check ("kind" in ('CHECKING', 'SAVINGS', 'CREDIT', 'CASH', 'INVESTMENT')) not null default 'CHECKING', "balance" bigint not null default 0, "connection_id" uuid null, "last_synced_at" timestamptz null, constraint "money_bank_account_pkey" primary key ("id"));`);
    this.addSql(`create index "money_bank_account_household_id_index" on "money_bank_account" ("household_id");`);

    this.addSql(`create table "platform_coach_message" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "period" varchar(7) not null, "kind" text check ("kind" in ('NUDGE', 'WIN', 'WARNING', 'INSIGHT', 'RITUAL')) not null default 'NUDGE', "text" text not null, "cta_label" varchar(60) null, "cta_href" varchar(200) null, "dismissed_at" timestamptz null, constraint "platform_coach_message_pkey" primary key ("id"));`);
    this.addSql(`create index "platform_coach_message_household_id_index" on "platform_coach_message" ("household_id");`);
    this.addSql(`create index "platform_coach_message_household_id_period_index" on "platform_coach_message" ("household_id", "period");`);

    this.addSql(`create table "money_debt" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "name" varchar(120) not null, "kind" text check ("kind" in ('CREDIT_CARD', 'LOAN', 'STUDENT', 'MORTGAGE', 'FAMILY', 'OTHER')) not null default 'LOAN', "balance" bigint not null, "original_balance" bigint not null, "interest_rate" numeric(5,2) not null default 0.00, "minimum_payment" bigint not null default 0, "extra_payment" bigint not null default 0, "due_day" int null, "closed_on" date null, constraint "money_debt_pkey" primary key ("id"));`);
    this.addSql(`create index "money_debt_household_id_index" on "money_debt" ("household_id");`);

    this.addSql(`create table "energy_log" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "user_id" varchar(64) not null, "logged_on" date not null, "metric" text check ("metric" in ('SLEEP', 'TRAIN', 'FOOD', 'MIND')) not null, "value" numeric(5,2) not null, "note" varchar(280) null, constraint "energy_log_pkey" primary key ("id"));`);
    this.addSql(`create index "energy_log_household_id_index" on "energy_log" ("household_id");`);
    this.addSql(`create index "energy_log_household_id_logged_on_index" on "energy_log" ("household_id", "logged_on");`);
    this.addSql(`alter table "energy_log" add constraint "energy_log_user_id_logged_on_metric_unique" unique ("user_id", "logged_on", "metric");`);

    this.addSql(`create table "soul_gratitude" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "user_id" varchar(64) not null, "week" varchar(8) not null, "text" varchar(280) not null, constraint "soul_gratitude_pkey" primary key ("id"));`);
    this.addSql(`create index "soul_gratitude_household_id_index" on "soul_gratitude" ("household_id");`);
    this.addSql(`create index "soul_gratitude_household_id_week_index" on "soul_gratitude" ("household_id", "week");`);

    this.addSql(`create table "platform_household_settings" ("household_id" varchar(64) not null, "kind" text check ("kind" in ('family', 'partners', 'friends', 'solo')) not null default 'solo', "currency" text check ("currency" in ('EUR', 'USD', 'GBP')) not null default 'EUR', "period_start_day" int not null default 1, "ritual_reminder_at" varchar(5) null default '19:00', "ritual_reminder_day" int null default 7, "bank_sync_enabled" boolean not null default false, "coach_enabled" boolean not null default true, "why" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "platform_household_settings_pkey" primary key ("household_id"));`);

    this.addSql(`create table "growth_lever" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "label" varchar(160) not null, "note" text null, "potential_monthly" bigint not null default 0, "done" boolean not null default false, constraint "growth_lever_pkey" primary key ("id"));`);
    this.addSql(`create index "growth_lever_household_id_index" on "growth_lever" ("household_id");`);

    this.addSql(`create table "growth_milestone" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "label" varchar(160) not null, "target_monthly" bigint not null, "reached_on" date null, constraint "growth_milestone_pkey" primary key ("id"));`);
    this.addSql(`create index "growth_milestone_household_id_index" on "growth_milestone" ("household_id");`);

    this.addSql(`create table "money_income_source" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "name" varchar(120) not null, "kind" text check ("kind" in ('SALARY', 'FREELANCE', 'BENEFIT', 'RENTAL', 'DIVIDEND', 'OTHER')) not null default 'SALARY', "amount" bigint not null, "cadence" text check ("cadence" in ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'ONCE')) not null default 'MONTHLY', "expected_day" int null, "active" boolean not null default true, "started_on" date null, constraint "money_income_source_pkey" primary key ("id"));`);
    this.addSql(`create index "money_income_source_household_id_index" on "money_income_source" ("household_id");`);

    this.addSql(`create table "money_jar" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "key" text check ("key" in ('NECESSITIES', 'FINANCIAL_FREEDOM', 'EDUCATION', 'LONG_TERM_SAVINGS', 'PLAY', 'GIVE')) not null, "name" varchar(80) not null, "subtitle" varchar(160) null, "icon" varchar(8) null, "percentage" numeric(5,2) not null, "spendable" boolean not null default true, "sort_order" int not null default 0, constraint "money_jar_pkey" primary key ("id"));`);
    this.addSql(`create index "money_jar_household_id_index" on "money_jar" ("household_id");`);
    this.addSql(`alter table "money_jar" add constraint "money_jar_household_id_key_unique" unique ("household_id", "key");`);

    this.addSql(`create table "money_goal" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "jar_id" uuid null, "name" varchar(120) not null, "icon" varchar(8) null, "target" bigint not null, "saved" bigint not null default 0, "monthly_contribution" bigint not null default 0, "target_date" date null, "status" text check ("status" in ('ACTIVE', 'REACHED', 'PAUSED', 'ARCHIVED')) not null default 'ACTIVE', "why" text null, constraint "money_goal_pkey" primary key ("id"));`);
    this.addSql(`create index "money_goal_household_id_index" on "money_goal" ("household_id");`);

    this.addSql(`create table "money_category" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "jar_id" uuid not null, "name" varchar(80) not null, "budgeted" bigint not null default 0, "archived" boolean not null default false, constraint "money_category_pkey" primary key ("id"));`);
    this.addSql(`create index "money_category_household_id_index" on "money_category" ("household_id");`);

    this.addSql(`create table "money_fixed_cost" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "jar_id" uuid not null, "category_id" uuid null, "name" varchar(120) not null, "amount" bigint not null, "cadence" text check ("cadence" in ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'ONCE')) not null default 'MONTHLY', "due_day" int null, "direction" text check ("direction" in ('IN', 'OUT')) not null default 'OUT', "active" boolean not null default true, "ends_on" date null, "note" text null, constraint "money_fixed_cost_pkey" primary key ("id"));`);
    this.addSql(`create index "money_fixed_cost_household_id_index" on "money_fixed_cost" ("household_id");`);

    this.addSql(`create table "backoffice"."reference_jar_template" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "key" text check ("key" in ('NECESSITIES', 'FINANCIAL_FREEDOM', 'EDUCATION', 'LONG_TERM_SAVINGS', 'PLAY', 'GIVE')) not null, "name" varchar(80) not null, "subtitle" varchar(160) null, "icon" varchar(8) null, "default_percentage" numeric(5,2) not null, "spendable" boolean not null default true, "sort_order" int not null default 0, "active" boolean not null default true, constraint "reference_jar_template_pkey" primary key ("id"));`);
    this.addSql(`alter table "backoffice"."reference_jar_template" add constraint "reference_jar_template_key_unique" unique ("key");`);

    this.addSql(`create table "money_period_turn" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "period" varchar(7) not null, "score" int not null default 0, "max_score" int not null default 0, "level" int not null default 1, "closed" boolean not null default false, "closed_at" timestamptz null, constraint "money_period_turn_pkey" primary key ("id"));`);
    this.addSql(`create index "money_period_turn_household_id_index" on "money_period_turn" ("household_id");`);
    this.addSql(`alter table "money_period_turn" add constraint "money_period_turn_household_id_period_unique" unique ("household_id", "period");`);

    this.addSql(`create table "backoffice"."plan" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "key" text check ("key" in ('grip', 'ritme', 'groei')) not null, "name" varchar(40) not null, "rank" int not null, "price_monthly" numeric(8,2) not null default '0.00', "unlocks" jsonb not null default '[]', "sort_order" int not null default 0, "active" boolean not null default true, constraint "plan_pkey" primary key ("id"));`);
    this.addSql(`alter table "backoffice"."plan" add constraint "plan_key_unique" unique ("key");`);

    this.addSql(`create table "money_rule" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "field" text check ("field" in ('DESCRIPTION', 'COUNTERPARTY', 'AMOUNT')) not null default 'DESCRIPTION', "matcher" text check ("matcher" in ('CONTAINS', 'EQUALS', 'STARTS_WITH', 'REGEX')) not null default 'CONTAINS', "value" varchar(200) not null, "jar_id" uuid not null, "category_id" uuid null, "priority" int not null default 100, "active" boolean not null default true, "hit_count" int not null default 0, constraint "money_rule_pkey" primary key ("id"));`);
    this.addSql(`create index "money_rule_household_id_index" on "money_rule" ("household_id");`);

    this.addSql(`create table "money_transaction" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "account_id" uuid null, "jar_id" uuid null, "category_id" uuid null, "amount" bigint not null, "booked_on" date not null, "description" varchar(280) not null, "counterparty" varchar(160) null, "status" text check ("status" in ('INBOX', 'SORTED', 'IGNORED')) not null default 'INBOX', "source" text check ("source" in ('MANUAL', 'CSV', 'BANK', 'RECURRING')) not null default 'MANUAL', "applied_rule_id" uuid null, "dedupe_key" varchar(64) null, "note" text null, constraint "money_transaction_pkey" primary key ("id"));`);
    this.addSql(`create index "money_transaction_household_id_index" on "money_transaction" ("household_id");`);
    this.addSql(`create index "money_transaction_dedupe_key_index" on "money_transaction" ("dedupe_key");`);
    this.addSql(`create index "money_transaction_household_id_status_index" on "money_transaction" ("household_id", "status");`);
    this.addSql(`create index "money_transaction_household_id_booked_on_index" on "money_transaction" ("household_id", "booked_on");`);

    this.addSql(`create table "money_turn_event" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "turn_id" uuid not null, "period" varchar(7) not null, "kind" text check ("kind" in ('JAR_HELD', 'JAR_OVERSPENT', 'INBOX_CLEARED', 'RITUAL_DONE', 'GOAL_REACHED', 'DEBT_CLEARED', 'INCOME_LOGGED', 'STREAK_KEPT')) not null, "day" int not null, "text" varchar(240) not null, "points" int not null default 0, constraint "money_turn_event_pkey" primary key ("id"));`);
    this.addSql(`create index "money_turn_event_household_id_index" on "money_turn_event" ("household_id");`);
    this.addSql(`create index "money_turn_event_household_id_period_index" on "money_turn_event" ("household_id", "period");`);

    this.addSql(`create table "money_weekly_ritual" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "week" varchar(8) not null, "stage" text check ("stage" in ('LOOK', 'REDIRECT', 'INTEND', 'DONE')) not null default 'LOOK', "surplus" bigint not null default 0, "intention" varchar(280) null, "completed_at" timestamptz null, constraint "money_weekly_ritual_pkey" primary key ("id"));`);
    this.addSql(`create index "money_weekly_ritual_household_id_index" on "money_weekly_ritual" ("household_id");`);
    this.addSql(`alter table "money_weekly_ritual" add constraint "money_weekly_ritual_household_id_week_unique" unique ("household_id", "week");`);

    this.addSql(`create table "money_ritual_allocation" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "household_id" varchar(64) not null, "ritual_id" uuid not null, "jar_id" uuid not null, "amount" bigint not null, constraint "money_ritual_allocation_pkey" primary key ("id"));`);
    this.addSql(`create index "money_ritual_allocation_household_id_index" on "money_ritual_allocation" ("household_id");`);
    this.addSql(`alter table "money_ritual_allocation" add constraint "money_ritual_allocation_ritual_id_jar_id_unique" unique ("ritual_id", "jar_id");`);

    this.addSql(`alter table "auth"."two_factor" add constraint "two_factor_user_id_foreign" foreign key ("user_id") references "auth"."user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "auth"."session" add constraint "session_user_id_foreign" foreign key ("user_id") references "auth"."user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "auth"."provider" add constraint "provider_user_id_foreign" foreign key ("user_id") references "auth"."user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "auth"."member" add constraint "member_organization_id_foreign" foreign key ("organization_id") references "auth"."organization" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "auth"."member" add constraint "member_user_id_foreign" foreign key ("user_id") references "auth"."user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "auth"."invitation" add constraint "invitation_organization_id_foreign" foreign key ("organization_id") references "auth"."organization" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "auth"."invitation" add constraint "invitation_inviter_id_foreign" foreign key ("inviter_id") references "auth"."user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "auth"."account" add constraint "account_user_id_foreign" foreign key ("user_id") references "auth"."user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "auth"."account_settings" add constraint "account_settings_account_id_foreign" foreign key ("account_id") references "auth"."account" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "money_goal" add constraint "money_goal_jar_id_foreign" foreign key ("jar_id") references "money_jar" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "money_category" add constraint "money_category_jar_id_foreign" foreign key ("jar_id") references "money_jar" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "money_fixed_cost" add constraint "money_fixed_cost_jar_id_foreign" foreign key ("jar_id") references "money_jar" ("id") on update cascade;`);
    this.addSql(`alter table "money_fixed_cost" add constraint "money_fixed_cost_category_id_foreign" foreign key ("category_id") references "money_category" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "money_rule" add constraint "money_rule_jar_id_foreign" foreign key ("jar_id") references "money_jar" ("id") on update cascade;`);
    this.addSql(`alter table "money_rule" add constraint "money_rule_category_id_foreign" foreign key ("category_id") references "money_category" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "money_transaction" add constraint "money_transaction_account_id_foreign" foreign key ("account_id") references "money_bank_account" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "money_transaction" add constraint "money_transaction_jar_id_foreign" foreign key ("jar_id") references "money_jar" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "money_transaction" add constraint "money_transaction_category_id_foreign" foreign key ("category_id") references "money_category" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "money_turn_event" add constraint "money_turn_event_turn_id_foreign" foreign key ("turn_id") references "money_period_turn" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "money_ritual_allocation" add constraint "money_ritual_allocation_ritual_id_foreign" foreign key ("ritual_id") references "money_weekly_ritual" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "money_ritual_allocation" add constraint "money_ritual_allocation_jar_id_foreign" foreign key ("jar_id") references "money_jar" ("id") on update cascade on delete cascade;`);
  }

}
