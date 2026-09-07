import { Migration } from '@mikro-orm/migrations';

/**
 * Align DB names with SpendingStyle + MonthScore (drop legacy character / turn names).
 */
export class Migration20260907190000_SpendingStyleAndMonthScoreDbNames extends Migration {
    override async up(): Promise<void> {
        // money_character → money_spending_style (column already spending_style)
        this.addSql(`alter type "public"."money_character" rename to "money_spending_style";`);

        // money_period_turn → money_month_score
        this.addSql(`alter table "public"."money_period_turn" rename to "money_month_score";`);
        this.addSql(
            `alter index "money_period_turn_pkey" rename to "money_month_score_pkey";`
        );
        this.addSql(
            `alter index "money_period_turn_household_id_index" rename to "money_month_score_household_id_index";`
        );
        this.addSql(
            `alter table "public"."money_month_score" rename constraint "money_period_turn_household_id_period_unique" to "money_month_score_household_id_period_unique";`
        );
        this.addSql(
            `alter table "public"."money_month_score" rename constraint "money_period_turn_household_id_foreign" to "money_month_score_household_id_foreign";`
        );

        // money_turn_event_kind → money_month_score_event_kind
        this.addSql(
            `alter type "public"."money_turn_event_kind" rename to "money_month_score_event_kind";`
        );

        // money_turn_event → money_month_score_event (+ turn_id → month_score_id)
        this.addSql(`alter table "public"."money_turn_event" rename to "money_month_score_event";`);
        this.addSql(
            `alter table "public"."money_month_score_event" rename column "turn_id" to "month_score_id";`
        );
        this.addSql(
            `alter index "money_turn_event_pkey" rename to "money_month_score_event_pkey";`
        );
        this.addSql(
            `alter index "money_turn_event_household_id_index" rename to "money_month_score_event_household_id_index";`
        );
        this.addSql(
            `alter index "money_turn_event_household_id_period_index" rename to "money_month_score_event_household_id_period_index";`
        );
        this.addSql(
            `alter table "public"."money_month_score_event" rename constraint "money_turn_event_household_id_foreign" to "money_month_score_event_household_id_foreign";`
        );
        this.addSql(
            `alter table "public"."money_month_score_event" rename constraint "money_turn_event_turn_id_foreign" to "money_month_score_event_month_score_id_foreign";`
        );
    }

    override async down(): Promise<void> {
        this.addSql(
            `alter table "public"."money_month_score_event" rename constraint "money_month_score_event_month_score_id_foreign" to "money_turn_event_turn_id_foreign";`
        );
        this.addSql(
            `alter table "public"."money_month_score_event" rename constraint "money_month_score_event_household_id_foreign" to "money_turn_event_household_id_foreign";`
        );
        this.addSql(
            `alter index "money_month_score_event_household_id_period_index" rename to "money_turn_event_household_id_period_index";`
        );
        this.addSql(
            `alter index "money_month_score_event_household_id_index" rename to "money_turn_event_household_id_index";`
        );
        this.addSql(
            `alter index "money_month_score_event_pkey" rename to "money_turn_event_pkey";`
        );
        this.addSql(
            `alter table "public"."money_month_score_event" rename column "month_score_id" to "turn_id";`
        );
        this.addSql(`alter table "public"."money_month_score_event" rename to "money_turn_event";`);

        this.addSql(
            `alter type "public"."money_month_score_event_kind" rename to "money_turn_event_kind";`
        );

        this.addSql(
            `alter table "public"."money_month_score" rename constraint "money_month_score_household_id_foreign" to "money_period_turn_household_id_foreign";`
        );
        this.addSql(
            `alter table "public"."money_month_score" rename constraint "money_month_score_household_id_period_unique" to "money_period_turn_household_id_period_unique";`
        );
        this.addSql(
            `alter index "money_month_score_household_id_index" rename to "money_period_turn_household_id_index";`
        );
        this.addSql(`alter index "money_month_score_pkey" rename to "money_period_turn_pkey";`);
        this.addSql(`alter table "public"."money_month_score" rename to "money_period_turn";`);

        this.addSql(`alter type "public"."money_spending_style" rename to "money_character";`);
    }
}
