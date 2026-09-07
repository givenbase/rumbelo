import { Migration } from '@mikro-orm/migrations';

/**
 * Rename Money weekly ritual → week-check (tables, enums, household settings column).
 * Capability keys renamed separately (Migration20260907240000_CapabilityKeyRename).
 */
export class Migration20260907230000_WeekCheckRename extends Migration {
    override async up(): Promise<void> {
        // money_weekly_ritual → money_week_check
        this.addSql(`alter table "public"."money_weekly_ritual" rename to "money_week_check";`);
        this.addSql(
            `alter index "money_weekly_ritual_pkey" rename to "money_week_check_pkey";`
        );
        this.addSql(
            `alter index "money_weekly_ritual_household_id_index" rename to "money_week_check_household_id_index";`
        );
        this.addSql(
            `alter table "public"."money_week_check" rename constraint "money_weekly_ritual_household_id_week_unique" to "money_week_check_household_id_week_unique";`
        );
        this.addSql(
            `alter table "public"."money_week_check" rename constraint "money_weekly_ritual_household_id_foreign" to "money_week_check_household_id_foreign";`
        );

        // money_ritual_stage → money_week_check_stage
        this.addSql(
            `alter type "public"."money_ritual_stage" rename to "money_week_check_stage";`
        );

        // money_ritual_allocation → money_week_check_allocation (+ ritual_id → week_check_id)
        this.addSql(
            `alter table "public"."money_ritual_allocation" rename to "money_week_check_allocation";`
        );
        this.addSql(
            `alter table "public"."money_week_check_allocation" rename column "ritual_id" to "week_check_id";`
        );
        this.addSql(
            `alter index "money_ritual_allocation_pkey" rename to "money_week_check_allocation_pkey";`
        );
        this.addSql(
            `alter index "money_ritual_allocation_household_id_index" rename to "money_week_check_allocation_household_id_index";`
        );
        this.addSql(
            `alter table "public"."money_week_check_allocation" rename constraint "money_ritual_allocation_ritual_id_jar_id_unique" to "money_week_check_allocation_week_check_id_jar_id_unique";`
        );
        this.addSql(
            `alter table "public"."money_week_check_allocation" rename constraint "money_ritual_allocation_household_id_foreign" to "money_week_check_allocation_household_id_foreign";`
        );
        this.addSql(
            `alter table "public"."money_week_check_allocation" rename constraint "money_ritual_allocation_jar_id_foreign" to "money_week_check_allocation_jar_id_foreign";`
        );
        this.addSql(
            `alter table "public"."money_week_check_allocation" rename constraint "money_ritual_allocation_ritual_id_foreign" to "money_week_check_allocation_week_check_id_foreign";`
        );

        // Enum labels
        this.addSql(
            `alter type "public"."money_month_score_event_kind" rename value 'RITUAL_DONE' to 'WEEK_CHECK_DONE';`
        );
        this.addSql(
            `alter type "public"."platform_coach_kind" rename value 'RITUAL' to 'WEEK_CHECK';`
        );

        // Household settings column (JSON shape is reminderDay/reminderAt — no nested ritual key)
        this.addSql(
            `alter table "auth"."household_settings" rename column "ritual_settings" to "week_check_settings";`
        );
    }

    override async down(): Promise<void> {
        this.addSql(
            `alter table "auth"."household_settings" rename column "week_check_settings" to "ritual_settings";`
        );

        this.addSql(
            `alter type "public"."platform_coach_kind" rename value 'WEEK_CHECK' to 'RITUAL';`
        );
        this.addSql(
            `alter type "public"."money_month_score_event_kind" rename value 'WEEK_CHECK_DONE' to 'RITUAL_DONE';`
        );

        this.addSql(
            `alter table "public"."money_week_check_allocation" rename constraint "money_week_check_allocation_week_check_id_foreign" to "money_ritual_allocation_ritual_id_foreign";`
        );
        this.addSql(
            `alter table "public"."money_week_check_allocation" rename constraint "money_week_check_allocation_jar_id_foreign" to "money_ritual_allocation_jar_id_foreign";`
        );
        this.addSql(
            `alter table "public"."money_week_check_allocation" rename constraint "money_week_check_allocation_household_id_foreign" to "money_ritual_allocation_household_id_foreign";`
        );
        this.addSql(
            `alter table "public"."money_week_check_allocation" rename constraint "money_week_check_allocation_week_check_id_jar_id_unique" to "money_ritual_allocation_ritual_id_jar_id_unique";`
        );
        this.addSql(
            `alter index "money_week_check_allocation_household_id_index" rename to "money_ritual_allocation_household_id_index";`
        );
        this.addSql(
            `alter index "money_week_check_allocation_pkey" rename to "money_ritual_allocation_pkey";`
        );
        this.addSql(
            `alter table "public"."money_week_check_allocation" rename column "week_check_id" to "ritual_id";`
        );
        this.addSql(
            `alter table "public"."money_week_check_allocation" rename to "money_ritual_allocation";`
        );

        this.addSql(
            `alter type "public"."money_week_check_stage" rename to "money_ritual_stage";`
        );

        this.addSql(
            `alter table "public"."money_week_check" rename constraint "money_week_check_household_id_foreign" to "money_weekly_ritual_household_id_foreign";`
        );
        this.addSql(
            `alter table "public"."money_week_check" rename constraint "money_week_check_household_id_week_unique" to "money_weekly_ritual_household_id_week_unique";`
        );
        this.addSql(
            `alter index "money_week_check_household_id_index" rename to "money_weekly_ritual_household_id_index";`
        );
        this.addSql(`alter index "money_week_check_pkey" rename to "money_weekly_ritual_pkey";`);
        this.addSql(`alter table "public"."money_week_check" rename to "money_weekly_ritual";`);
    }
}
