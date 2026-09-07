import { Migration } from '@mikro-orm/migrations';

/**
 * Stripe billing ids on household settings (server-only — not in public DTO).
 * Used to resolve webhooks and reuse customers on re-subscribe.
 */
export class Migration20260907150000_HouseholdStripeBilling extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            alter table "auth"."household_settings"
                add column if not exists "stripe_customer_id" varchar(255) null,
                add column if not exists "stripe_subscription_id" varchar(255) null;
        `);
        this.addSql(`
            create unique index if not exists "household_settings_stripe_subscription_id_unique"
                on "auth"."household_settings" ("stripe_subscription_id")
                where "stripe_subscription_id" is not null;
        `);
        this.addSql(`
            create index if not exists "household_settings_stripe_customer_id_index"
                on "auth"."household_settings" ("stripe_customer_id")
                where "stripe_customer_id" is not null;
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            drop index if exists "auth"."household_settings_stripe_subscription_id_unique";
        `);
        this.addSql(`
            drop index if exists "auth"."household_settings_stripe_customer_id_index";
        `);
        this.addSql(`
            alter table "auth"."household_settings"
                drop column if exists "stripe_customer_id",
                drop column if exists "stripe_subscription_id";
        `);
    }
}
