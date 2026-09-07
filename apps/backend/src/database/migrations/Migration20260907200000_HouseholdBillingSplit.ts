import { Migration } from '@mikro-orm/migrations';

/**
 * Split commercial subscription state out of household_settings into
 * auth.household_billing (1:1). Board prefs stay on settings; planKey + Stripe
 * ids move here. No invoice/payment history — Stripe remains ledger of record.
 */
export class Migration20260907200000_HouseholdBillingSplit extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            create table "auth"."household_billing" (
                "id" uuid not null,
                "created_at" timestamptz not null default now(),
                "updated_at" timestamptz not null default now(),
                "household_id" uuid not null,
                "stripe_customer_id" varchar(255) null,
                "stripe_subscription_id" varchar(255) null,
                "plan_key" "public"."backoffice_plan_key" not null default 'BASIC',
                constraint "household_billing_pkey" primary key ("id"),
                constraint "household_billing_household_id_unique" unique ("household_id")
            );
        `);
        this.addSql(`
            alter table "auth"."household_billing"
                add constraint "household_billing_household_id_foreign"
                foreign key ("household_id") references "auth"."household" ("id")
                on update cascade on delete cascade;
        `);
        this.addSql(`
            create index "household_billing_household_id_index"
                on "auth"."household_billing" ("household_id");
        `);
        this.addSql(`
            create index "household_billing_stripe_customer_id_index"
                on "auth"."household_billing" ("stripe_customer_id")
                where "stripe_customer_id" is not null;
        `);
        this.addSql(`
            create unique index "household_billing_stripe_subscription_id_unique"
                on "auth"."household_billing" ("stripe_subscription_id")
                where "stripe_subscription_id" is not null;
        `);

        this.addSql(`
            insert into "auth"."household_billing" (
                "id",
                "created_at",
                "updated_at",
                "household_id",
                "stripe_customer_id",
                "stripe_subscription_id",
                "plan_key"
            )
            select
                gen_random_uuid(),
                "created_at",
                "updated_at",
                "household_id",
                "stripe_customer_id",
                "stripe_subscription_id",
                "plan_key"
            from "auth"."household_settings";
        `);

        this.addSql(`
            drop index if exists "auth"."household_settings_stripe_customer_id_index";
        `);
        this.addSql(`
            drop index if exists "auth"."household_settings_stripe_subscription_id_unique";
        `);
        this.addSql(`
            alter table "auth"."household_settings"
                drop column "stripe_customer_id",
                drop column "stripe_subscription_id",
                drop column "plan_key";
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "auth"."household_settings"
                add column "plan_key" "public"."backoffice_plan_key" not null default 'BASIC',
                add column "stripe_customer_id" varchar(255) null,
                add column "stripe_subscription_id" varchar(255) null;
        `);
        this.addSql(`
            update "auth"."household_settings" as s
            set
                "plan_key" = b."plan_key",
                "stripe_customer_id" = b."stripe_customer_id",
                "stripe_subscription_id" = b."stripe_subscription_id"
            from "auth"."household_billing" as b
            where b."household_id" = s."household_id";
        `);
        this.addSql(`
            create index "household_settings_stripe_customer_id_index"
                on "auth"."household_settings" ("stripe_customer_id")
                where "stripe_customer_id" is not null;
        `);
        this.addSql(`
            create unique index "household_settings_stripe_subscription_id_unique"
                on "auth"."household_settings" ("stripe_subscription_id")
                where "stripe_subscription_id" is not null;
        `);
        this.addSql(`drop table if exists "auth"."household_billing";`);
    }
}
