import { Migration } from '@mikro-orm/migrations';

/**
 * Rename moneySettings JSON key incomeRhythm → incomeStability.
 */
export class Migration20260907143000_IncomeStabilityRename extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            update "auth"."household_settings"
            set "money_settings" =
                ("money_settings" - 'incomeRhythm')
                || jsonb_build_object(
                    'incomeStability',
                    coalesce("money_settings"->>'incomeRhythm', 'STABLE')
                )
            where "money_settings" ? 'incomeRhythm';
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            update "auth"."household_settings"
            set "money_settings" =
                ("money_settings" - 'incomeStability')
                || jsonb_build_object(
                    'incomeRhythm',
                    coalesce("money_settings"->>'incomeStability', 'STABLE')
                )
            where "money_settings" ? 'incomeStability';
        `);
    }
}
