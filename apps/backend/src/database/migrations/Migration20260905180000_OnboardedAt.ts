import { Migration } from '@mikro-orm/migrations';

/**
 * Personal + household onboard timestamps (durable flags; not localStorage).
 */
export class Migration20260905180000_OnboardedAt extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `alter table "auth"."account_settings" add column "onboarded_at" timestamptz null;`
        );
        this.addSql(
            `alter table "platform_household_settings" add column "onboarded_at" timestamptz null;`
        );
        // Existing households already went through onboard — treat as complete.
        this.addSql(`update "platform_household_settings" set "onboarded_at" = "created_at";`);
        // Existing accounts that already have a household membership → personal onboard done.
        this.addSql(`
            update "auth"."account_settings" as s
            set "onboarded_at" = s."created_at"
            where exists (
                select 1
                from "auth"."account" a
                join "auth"."member" m on m."user_id" = a."user_id"
                where a."id" = s."account_id"
            );
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`alter table "auth"."account_settings" drop column "onboarded_at";`);
        this.addSql(`alter table "platform_household_settings" drop column "onboarded_at";`);
    }
}
