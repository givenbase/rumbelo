import { Migration } from '@mikro-orm/migrations';

export class Migration20260827064108_household_id_varchar extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "money"."bank_account" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "platform"."coach_message" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "money"."debt" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "energy"."energy_log" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "soul"."gratitude" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "platform"."household_settings" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "growth"."income_lever" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "growth"."income_milestone" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "money"."income_source" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "money"."jar" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "money"."goal" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "money"."category" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "money"."fixed_cost" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "money"."period_turn" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "money"."rule" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "money"."transaction" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "money"."turn_event" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "money"."weekly_ritual" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "money"."ritual_allocation" alter column "household_id" type text using ("household_id"::text);`);

    this.addSql(`alter table "money"."bank_account" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "platform"."coach_message" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "money"."debt" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);
    this.addSql(`alter table "money"."debt" alter column "interest_rate" type numeric(5,2) using ("interest_rate"::numeric(5,2));`);
    this.addSql(`alter table "money"."debt" alter column "interest_rate" set default '0.00';`);

    this.addSql(`alter table "energy"."energy_log" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "soul"."gratitude" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "platform"."household_settings" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "growth"."income_lever" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "growth"."income_milestone" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "money"."income_source" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "money"."jar" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "money"."goal" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "money"."category" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "money"."fixed_cost" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "money"."period_turn" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "money"."rule" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "money"."transaction" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "money"."turn_event" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "money"."weekly_ritual" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);

    this.addSql(`alter table "money"."ritual_allocation" alter column "household_id" type varchar(64) using ("household_id"::varchar(64));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "money"."bank_account" alter column "household_id" drop default;`);
    this.addSql(`alter table "money"."bank_account" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "money"."category" alter column "household_id" drop default;`);
    this.addSql(`alter table "money"."category" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "platform"."coach_message" alter column "household_id" drop default;`);
    this.addSql(`alter table "platform"."coach_message" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "money"."debt" alter column "household_id" drop default;`);
    this.addSql(`alter table "money"."debt" alter column "household_id" type uuid using ("household_id"::text::uuid);`);
    this.addSql(`alter table "money"."debt" alter column "interest_rate" type numeric(5,2) using ("interest_rate"::numeric(5,2));`);
    this.addSql(`alter table "money"."debt" alter column "interest_rate" set default 0.00;`);

    this.addSql(`alter table "energy"."energy_log" alter column "household_id" drop default;`);
    this.addSql(`alter table "energy"."energy_log" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "money"."fixed_cost" alter column "household_id" drop default;`);
    this.addSql(`alter table "money"."fixed_cost" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "money"."goal" alter column "household_id" drop default;`);
    this.addSql(`alter table "money"."goal" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "soul"."gratitude" alter column "household_id" drop default;`);
    this.addSql(`alter table "soul"."gratitude" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "platform"."household_settings" alter column "household_id" drop default;`);
    this.addSql(`alter table "platform"."household_settings" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "growth"."income_lever" alter column "household_id" drop default;`);
    this.addSql(`alter table "growth"."income_lever" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "growth"."income_milestone" alter column "household_id" drop default;`);
    this.addSql(`alter table "growth"."income_milestone" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "money"."income_source" alter column "household_id" drop default;`);
    this.addSql(`alter table "money"."income_source" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "money"."jar" alter column "household_id" drop default;`);
    this.addSql(`alter table "money"."jar" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "money"."period_turn" alter column "household_id" drop default;`);
    this.addSql(`alter table "money"."period_turn" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "money"."ritual_allocation" alter column "household_id" drop default;`);
    this.addSql(`alter table "money"."ritual_allocation" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "money"."rule" alter column "household_id" drop default;`);
    this.addSql(`alter table "money"."rule" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "money"."transaction" alter column "household_id" drop default;`);
    this.addSql(`alter table "money"."transaction" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "money"."turn_event" alter column "household_id" drop default;`);
    this.addSql(`alter table "money"."turn_event" alter column "household_id" type uuid using ("household_id"::text::uuid);`);

    this.addSql(`alter table "money"."weekly_ritual" alter column "household_id" drop default;`);
    this.addSql(`alter table "money"."weekly_ritual" alter column "household_id" type uuid using ("household_id"::text::uuid);`);
  }

}
