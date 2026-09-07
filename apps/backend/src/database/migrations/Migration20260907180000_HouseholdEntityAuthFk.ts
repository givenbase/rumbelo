import { Migration } from '@mikro-orm/migrations';

/**
 * DB FKs for {@link HouseholdEntity.householdId} → `auth.household`
 * (ORM: `@ManyToOne(() => AuthHousehold, { mapToPk: true })`).
 *
 * Product + settings rows cascade when a Better Auth household is deleted.
 */
export class Migration20260907180000_HouseholdEntityAuthFk extends Migration {
    override async up(): Promise<void> {
        const tables: Array<{ schema: string; table: string }> = [
            { schema: 'auth', table: 'household_settings' },
            { schema: 'public', table: 'energy_log' },
            { schema: 'public', table: 'growth_lever' },
            { schema: 'public', table: 'growth_milestone' },
            { schema: 'public', table: 'money_bank_account' },
            { schema: 'public', table: 'money_category' },
            { schema: 'public', table: 'money_debt' },
            { schema: 'public', table: 'money_fixed_cost' },
            { schema: 'public', table: 'money_goal' },
            { schema: 'public', table: 'money_income_amount_period' },
            { schema: 'public', table: 'money_income_source' },
            { schema: 'public', table: 'money_jar' },
            { schema: 'public', table: 'money_period_turn' },
            { schema: 'public', table: 'money_ritual_allocation' },
            { schema: 'public', table: 'money_rule' },
            { schema: 'public', table: 'money_transaction' },
            { schema: 'public', table: 'money_turn_event' },
            { schema: 'public', table: 'money_weekly_ritual' },
            { schema: 'public', table: 'platform_coach_message' },
            { schema: 'public', table: 'soul_gratitude' },
        ];

        for (const { schema, table } of tables) {
            const name = `${table}_household_id_foreign`;
            this.addSql(`
                alter table "${schema}"."${table}"
                    add constraint "${name}"
                    foreign key ("household_id") references "auth"."household" ("id")
                    on update cascade on delete cascade;
            `);
        }
    }

    override async down(): Promise<void> {
        const tables = [
            'household_settings',
            'energy_log',
            'growth_lever',
            'growth_milestone',
            'money_bank_account',
            'money_category',
            'money_debt',
            'money_fixed_cost',
            'money_goal',
            'money_income_amount_period',
            'money_income_source',
            'money_jar',
            'money_period_turn',
            'money_ritual_allocation',
            'money_rule',
            'money_transaction',
            'money_turn_event',
            'money_weekly_ritual',
            'platform_coach_message',
            'soul_gratitude',
        ] as const;

        for (const table of tables) {
            const schema = table === 'household_settings' ? 'auth' : 'public';
            this.addSql(`
                alter table "${schema}"."${table}"
                    drop constraint if exists "${table}_household_id_foreign";
            `);
        }
    }
}
