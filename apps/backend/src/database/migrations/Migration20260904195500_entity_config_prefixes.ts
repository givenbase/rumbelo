import { Migration } from '@mikro-orm/migrations';

/**
 * Apply entityConfig domain prefixes now that product tables live in `public`.
 */
export class Migration20260904195500_entity_config_prefixes extends Migration {
    override async up(): Promise<void> {
        const renames: Array<[string, string, string]> = [
            // schema, from, to
            ['public', 'bank_account', 'money_bank_account'],
            ['public', 'debt', 'money_debt'],
            ['public', 'income_source', 'money_income_source'],
            ['public', 'jar', 'money_jar'],
            ['public', 'goal', 'money_goal'],
            ['public', 'category', 'money_category'],
            ['public', 'fixed_cost', 'money_fixed_cost'],
            ['public', 'period_turn', 'money_period_turn'],
            ['public', 'rule', 'money_rule'],
            ['public', 'transaction', 'money_transaction'],
            ['public', 'turn_event', 'money_turn_event'],
            ['public', 'weekly_ritual', 'money_weekly_ritual'],
            ['public', 'ritual_allocation', 'money_ritual_allocation'],
            ['public', 'coach_message', 'platform_coach_message'],
            ['public', 'household_settings', 'platform_household_settings'],
            ['public', 'gratitude', 'soul_gratitude'],
            ['public', 'income_lever', 'growth_lever'],
            ['public', 'income_milestone', 'growth_milestone'],
            ['backoffice', 'jar_template', 'reference_jar_template'],
        ];

        for (const [schema, from, to] of renames) {
            this.addSql(
                `alter table if exists "${schema}"."${from}" rename to "${to}";`
            );
        }
    }

    override async down(): Promise<void> {
        const renames: Array<[string, string, string]> = [
            ['public', 'money_bank_account', 'bank_account'],
            ['public', 'money_debt', 'debt'],
            ['public', 'money_income_source', 'income_source'],
            ['public', 'money_jar', 'jar'],
            ['public', 'money_goal', 'goal'],
            ['public', 'money_category', 'category'],
            ['public', 'money_fixed_cost', 'fixed_cost'],
            ['public', 'money_period_turn', 'period_turn'],
            ['public', 'money_rule', 'rule'],
            ['public', 'money_transaction', 'transaction'],
            ['public', 'money_turn_event', 'turn_event'],
            ['public', 'money_weekly_ritual', 'weekly_ritual'],
            ['public', 'money_ritual_allocation', 'ritual_allocation'],
            ['public', 'platform_coach_message', 'coach_message'],
            ['public', 'platform_household_settings', 'household_settings'],
            ['public', 'soul_gratitude', 'gratitude'],
            ['public', 'growth_lever', 'income_lever'],
            ['public', 'growth_milestone', 'income_milestone'],
            ['backoffice', 'reference_jar_template', 'jar_template'],
        ];

        for (const [schema, from, to] of renames) {
            this.addSql(
                `alter table if exists "${schema}"."${from}" rename to "${to}";`
            );
        }
    }
}
