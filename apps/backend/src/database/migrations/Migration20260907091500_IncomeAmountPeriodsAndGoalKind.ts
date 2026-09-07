import { Migration } from '@mikro-orm/migrations';

/**
 * Income amount periods (history) + GoalKind / fulfilledOn for earn goals.
 */
export class Migration20260907091500_IncomeAmountPeriodsAndGoalKind extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            do $$ begin
                create type "money_goal_kind" as enum ('SAVE', 'EARN');
            exception when duplicate_object then null;
            end $$;
        `);

        this.addSql(`
            alter table "money_goal"
                add column if not exists "kind" "money_goal_kind" not null default 'SAVE';
        `);
        this.addSql(`
            alter table "money_goal"
                add column if not exists "fulfilled_on" date null;
        `);

        this.addSql(`
            create table if not exists "money_income_amount_period" (
                "id" uuid not null,
                "created_at" timestamptz not null default now(),
                "updated_at" timestamptz not null default now(),
                "household_id" varchar(64) not null,
                "amount" bigint not null,
                "effective_on" date not null,
                "income_source_id" uuid not null,
                constraint "money_income_amount_period_pkey" primary key ("id")
            );
        `);
        this.addSql(`
            create index if not exists "money_income_amount_period_household_id_index"
                on "money_income_amount_period" ("household_id");
        `);
        this.addSql(`
            do $$ begin
                alter table "money_income_amount_period"
                    add constraint "money_income_amount_period_income_source_id_foreign"
                    foreign key ("income_source_id") references "money_income_source" ("id")
                    on update cascade on delete cascade;
            exception when duplicate_object then null;
            end $$;
        `);

        this.addSql(`
            do $$ begin
                alter table "money_income_amount_period"
                    rename column "effective_from" to "effective_on";
            exception
                when undefined_column then null;
                when duplicate_column then null;
            end $$;
        `);

        // Backfill one period per existing source.
        this.addSql(`
            insert into "money_income_amount_period"
                ("id", "created_at", "updated_at", "household_id", "amount", "effective_on", "income_source_id")
            select
                gen_random_uuid(),
                now(),
                now(),
                s."household_id",
                s."amount",
                coalesce(s."started_on", (s."created_at" at time zone 'utc')::date),
                s."id"
            from "money_income_source" s
            where not exists (
                select 1 from "money_income_amount_period" p
                where p."income_source_id" = s."id"
            );
        `);
    }
}
