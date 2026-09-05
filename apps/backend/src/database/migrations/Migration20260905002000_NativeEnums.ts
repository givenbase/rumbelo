import { Migration } from '@mikro-orm/migrations';

/**
 * Promote text+CHECK enum columns to native PostgreSQL enums in `public`,
 * matching `NativeEnum({ … })` names (e.g. `public.money_debt_kind`).
 */
export class Migration20260905002000_NativeEnums extends Migration {
    override async up(): Promise<void> {
        // ── create types (idempotent-ish: only if missing) ──────────────────
        this.addSql(`do $$ begin
  create type "public"."auth_locale" as enum ('NL', 'EN');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."auth_theme" as enum ('LIGHT', 'DARK', 'SYSTEM');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."platform_household_kind" as enum ('FAMILY', 'PARTNERS', 'FRIENDS', 'SOLO');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."platform_currency" as enum ('EUR', 'USD', 'GBP');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."platform_coach_kind" as enum ('NUDGE', 'WIN', 'WARNING', 'INSIGHT', 'RITUAL');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."backoffice_plan_key" as enum ('GRIP', 'RITME', 'GROEI');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_jar_key" as enum ('NECESSITIES', 'FINANCIAL_FREEDOM', 'EDUCATION', 'LONG_TERM_SAVINGS', 'PLAY', 'GIVE');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_cadence" as enum ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'ONCE');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_flow_direction" as enum ('IN', 'OUT');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_debt_kind" as enum ('CREDIT_CARD', 'LOAN', 'STUDENT', 'MORTGAGE', 'FAMILY', 'OTHER');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_income_kind" as enum ('SALARY', 'FREELANCE', 'BENEFIT', 'RENTAL', 'DIVIDEND', 'OTHER');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_goal_status" as enum ('ACTIVE', 'REACHED', 'PAUSED', 'ARCHIVED');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_account_kind" as enum ('CHECKING', 'SAVINGS', 'CREDIT', 'CASH', 'INVESTMENT');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_transaction_status" as enum ('INBOX', 'SORTED', 'IGNORED');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_transaction_source" as enum ('MANUAL', 'CSV', 'BANK', 'RECURRING');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_rule_field" as enum ('DESCRIPTION', 'COUNTERPARTY', 'AMOUNT');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_rule_matcher" as enum ('CONTAINS', 'EQUALS', 'STARTS_WITH', 'REGEX');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_ritual_stage" as enum ('LOOK', 'REDIRECT', 'INTEND', 'DONE');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_turn_event_kind" as enum ('JAR_HELD', 'JAR_OVERSPENT', 'INBOX_CLEARED', 'RITUAL_DONE', 'GOAL_REACHED', 'DEBT_CLEARED', 'INCOME_LOGGED', 'STREAK_KEPT');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."energy_metric" as enum ('SLEEP', 'TRAIN', 'FOOD', 'MIND');
exception when duplicate_object then null; end $$;`);

        // ── auth ────────────────────────────────────────────────────────────
        this.castColumn('auth', 'account_settings', 'locale', 'auth_locale', "'NL'");
        this.castColumn('auth', 'account_settings', 'theme', 'auth_theme', "'SYSTEM'");

        // ── platform (public schema tables) ─────────────────────────────────
        this.castColumn('public', 'platform_household_settings', 'kind', 'platform_household_kind', "'SOLO'");
        this.castColumn('public', 'platform_household_settings', 'currency', 'platform_currency', "'EUR'");
        this.castColumn('public', 'platform_coach_message', 'kind', 'platform_coach_kind', "'NUDGE'");

        // ── backoffice ──────────────────────────────────────────────────────
        this.castColumn('backoffice', 'plan', 'key', 'backoffice_plan_key', null);
        this.castColumn('backoffice', 'reference_jar_template', 'key', 'money_jar_key', null);
        this.castColumn('backoffice', 'reference_debt_preset', 'kind', 'money_debt_kind', null);
        this.castColumn('backoffice', 'reference_income_source_preset', 'kind', 'money_income_kind', null);
        this.castColumn(
            'backoffice',
            'reference_income_source_preset',
            'default_cadence',
            'money_cadence',
            "'MONTHLY'"
        );
        this.castColumn(
            'backoffice',
            'reference_fixed_cost_preset',
            'default_cadence',
            'money_cadence',
            "'MONTHLY'"
        );
        this.castColumn(
            'backoffice',
            'reference_fixed_cost_preset',
            'direction',
            'money_flow_direction',
            "'OUT'"
        );

        // ── money ───────────────────────────────────────────────────────────
        this.castColumn('public', 'money_bank_account', 'kind', 'money_account_kind', "'CHECKING'");
        this.castColumn('public', 'money_debt', 'kind', 'money_debt_kind', "'LOAN'");
        this.castColumn('public', 'money_income_source', 'kind', 'money_income_kind', "'SALARY'");
        this.castColumn('public', 'money_income_source', 'cadence', 'money_cadence', "'MONTHLY'");
        this.castColumn('public', 'money_jar', 'key', 'money_jar_key', null);
        this.castColumn('public', 'money_goal', 'status', 'money_goal_status', "'ACTIVE'");
        this.castColumn('public', 'money_fixed_cost', 'cadence', 'money_cadence', "'MONTHLY'");
        this.castColumn('public', 'money_fixed_cost', 'direction', 'money_flow_direction', "'OUT'");
        this.castColumn('public', 'money_rule', 'field', 'money_rule_field', "'DESCRIPTION'");
        this.castColumn('public', 'money_rule', 'matcher', 'money_rule_matcher', "'CONTAINS'");
        this.castColumn('public', 'money_transaction', 'status', 'money_transaction_status', "'INBOX'");
        this.castColumn('public', 'money_transaction', 'source', 'money_transaction_source', "'MANUAL'");
        this.castColumn('public', 'money_turn_event', 'kind', 'money_turn_event_kind', null);
        this.castColumn('public', 'money_weekly_ritual', 'stage', 'money_ritual_stage', "'LOOK'");

        // ── energy ──────────────────────────────────────────────────────────
        this.castColumn('public', 'energy_log', 'metric', 'energy_metric', null);
    }

    /** Drop CHECK, cast text → native enum, restore default when provided. */
    private castColumn(
        schema: string,
        table: string,
        column: string,
        enumType: string,
        defaultLiteral: string | null
    ): void {
        const fq = schema === 'public' ? `"${table}"` : `"${schema}"."${table}"`;
        // Postgres names inline checks `{table}_{column}_check` in most cases.
        this.addSql(
            `alter table ${fq} drop constraint if exists "${table}_${column}_check";`
        );
        if (defaultLiteral !== null) {
            this.addSql(`alter table ${fq} alter column "${column}" drop default;`);
        }
        this.addSql(
            `alter table ${fq} alter column "${column}" type "public"."${enumType}" using ("${column}"::text::"public"."${enumType}");`
        );
        if (defaultLiteral !== null) {
            this.addSql(
                `alter table ${fq} alter column "${column}" set default ${defaultLiteral}::"public"."${enumType}";`
            );
        }
    }
}
