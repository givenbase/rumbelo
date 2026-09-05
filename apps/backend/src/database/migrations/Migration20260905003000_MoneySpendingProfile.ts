import { Migration } from '@mikro-orm/migrations';

/**
 * Money spending profile: person moneyCharacter + household payoffStrategy / incomeRhythm.
 */
export class Migration20260905003000_MoneySpendingProfile extends Migration {
    override async up(): Promise<void> {
        this.addSql(`do $$ begin
  create type "public"."auth_money_character" as enum ('SPENDER', 'SAVER', 'BALANCED', 'UNKNOWN');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."money_payoff_strategy" as enum ('AVALANCHE', 'SNOWBALL');
exception when duplicate_object then null; end $$;`);
        this.addSql(`do $$ begin
  create type "public"."platform_income_rhythm" as enum ('STABLE', 'VARIABLE');
exception when duplicate_object then null; end $$;`);

        this.addSql(
            `alter table "auth"."account_settings" add column "money_character" "public"."auth_money_character" not null default 'UNKNOWN';`
        );

        this.addSql(
            `alter table "platform_household_settings" add column "payoff_strategy" "public"."money_payoff_strategy" not null default 'AVALANCHE';`
        );
        this.addSql(
            `alter table "platform_household_settings" add column "income_rhythm" "public"."platform_income_rhythm" not null default 'STABLE';`
        );
    }

    override async down(): Promise<void> {
        this.addSql(`alter table "platform_household_settings" drop column if exists "income_rhythm";`);
        this.addSql(
            `alter table "platform_household_settings" drop column if exists "payoff_strategy";`
        );
        this.addSql(`alter table "auth"."account_settings" drop column if exists "money_character";`);

        this.addSql(`drop type if exists "public"."platform_income_rhythm";`);
        this.addSql(`drop type if exists "public"."money_payoff_strategy";`);
        this.addSql(`drop type if exists "public"."auth_money_character";`);
    }
}
