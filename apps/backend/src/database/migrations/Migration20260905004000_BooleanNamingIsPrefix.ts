import { Migration } from '@mikro-orm/migrations';

/**
 * Affirmative boolean column names: active → is_active, spendable → is_spendable, etc.
 * @see apps/backend/docs/ENTITY_STYLE.md — Field naming by kind
 */
export class Migration20260905004000_BooleanNamingIsPrefix extends Migration {
    override async up(): Promise<void> {
        // public / money
        this.addSql(`alter table "money_income_source" rename column "active" to "is_active";`);
        this.addSql(`alter table "money_fixed_cost" rename column "active" to "is_active";`);
        this.addSql(`alter table "money_rule" rename column "active" to "is_active";`);
        this.addSql(`alter table "money_jar" rename column "spendable" to "is_spendable";`);
        this.addSql(`alter table "money_category" rename column "archived" to "is_archived";`);
        this.addSql(`alter table "money_period_turn" rename column "closed" to "is_closed";`);
        this.addSql(`alter table "growth_lever" rename column "done" to "is_done";`);

        this.addSql(
            `alter table "platform_household_settings" rename column "bank_sync_enabled" to "is_bank_sync_enabled";`
        );
        this.addSql(
            `alter table "platform_household_settings" rename column "coach_enabled" to "is_coach_enabled";`
        );

        // backoffice
        this.addSql(`alter table "backoffice"."plan" rename column "active" to "is_active";`);
        this.addSql(
            `alter table "backoffice"."reference_jar_template" rename column "active" to "is_active";`
        );
        this.addSql(
            `alter table "backoffice"."reference_jar_template" rename column "spendable" to "is_spendable";`
        );
        this.addSql(
            `alter table "backoffice"."reference_category_template" rename column "active" to "is_active";`
        );
        this.addSql(
            `alter table "backoffice"."reference_debt_preset" rename column "active" to "is_active";`
        );
        this.addSql(
            `alter table "backoffice"."reference_fixed_cost_preset" rename column "active" to "is_active";`
        );
        this.addSql(
            `alter table "backoffice"."reference_goal_preset" rename column "active" to "is_active";`
        );
        this.addSql(
            `alter table "backoffice"."reference_income_source_preset" rename column "active" to "is_active";`
        );
        this.addSql(
            `alter table "backoffice"."reference_merchant_preset" rename column "active" to "is_active";`
        );
    }

    override async down(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."reference_merchant_preset" rename column "is_active" to "active";`
        );
        this.addSql(
            `alter table "backoffice"."reference_income_source_preset" rename column "is_active" to "active";`
        );
        this.addSql(
            `alter table "backoffice"."reference_goal_preset" rename column "is_active" to "active";`
        );
        this.addSql(
            `alter table "backoffice"."reference_fixed_cost_preset" rename column "is_active" to "active";`
        );
        this.addSql(
            `alter table "backoffice"."reference_debt_preset" rename column "is_active" to "active";`
        );
        this.addSql(
            `alter table "backoffice"."reference_category_template" rename column "is_active" to "active";`
        );
        this.addSql(
            `alter table "backoffice"."reference_jar_template" rename column "is_spendable" to "spendable";`
        );
        this.addSql(
            `alter table "backoffice"."reference_jar_template" rename column "is_active" to "active";`
        );
        this.addSql(`alter table "backoffice"."plan" rename column "is_active" to "active";`);

        this.addSql(
            `alter table "platform_household_settings" rename column "is_coach_enabled" to "coach_enabled";`
        );
        this.addSql(
            `alter table "platform_household_settings" rename column "is_bank_sync_enabled" to "bank_sync_enabled";`
        );

        this.addSql(`alter table "growth_lever" rename column "is_done" to "done";`);
        this.addSql(`alter table "money_period_turn" rename column "is_closed" to "closed";`);
        this.addSql(`alter table "money_category" rename column "is_archived" to "archived";`);
        this.addSql(`alter table "money_jar" rename column "is_spendable" to "spendable";`);
        this.addSql(`alter table "money_rule" rename column "is_active" to "active";`);
        this.addSql(`alter table "money_fixed_cost" rename column "is_active" to "active";`);
        this.addSql(`alter table "money_income_source" rename column "is_active" to "active";`);
    }
}
