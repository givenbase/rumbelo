import { Migration } from '@mikro-orm/migrations';

/**
 * Track a plan change scheduled for period end (cancel → Basic, or Max → Plus)
 * while entitlements stay on the current planKey until then.
 */
export class Migration20260907220000_HouseholdBillingScheduledPlan extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            alter table "auth"."household_billing"
                add column "scheduled_plan_key" "public"."backoffice_plan_key" null;
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "auth"."household_billing"
                drop column "scheduled_plan_key";
        `);
    }
}
