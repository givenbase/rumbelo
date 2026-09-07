import { Migration } from '@mikro-orm/migrations';

/**
 * Mirror Stripe billing period + cancel-at-period-end + reserved trial end
 * onto auth.household_billing (for renew UI / future 14-day trials).
 */
export class Migration20260907210000_HouseholdBillingPeriodFields extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            alter table "auth"."household_billing"
                add column "period_started_at" timestamptz null,
                add column "period_ends_at" timestamptz null,
                add column "trial_ends_at" timestamptz null,
                add column "is_cancel_at_period_end" boolean not null default false;
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "auth"."household_billing"
                drop column "period_started_at",
                drop column "period_ends_at",
                drop column "trial_ends_at",
                drop column "is_cancel_at_period_end";
        `);
    }
}
