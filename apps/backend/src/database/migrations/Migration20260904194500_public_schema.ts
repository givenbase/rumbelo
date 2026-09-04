import { Migration } from '@mikro-orm/migrations';

/**
 * Collapse product/platform domain schemas into `public`.
 * Keep `auth` and `backoffice` as their own schemas.
 */
export class Migration20260904194500_public_schema extends Migration {
    override async up(): Promise<void> {
        const moves: Array<[string, string]> = [
            ['money', 'bank_account'],
            ['money', 'debt'],
            ['money', 'income_source'],
            ['money', 'jar'],
            ['money', 'goal'],
            ['money', 'category'],
            ['money', 'fixed_cost'],
            ['money', 'period_turn'],
            ['money', 'rule'],
            ['money', 'transaction'],
            ['money', 'turn_event'],
            ['money', 'weekly_ritual'],
            ['money', 'ritual_allocation'],
            ['platform', 'coach_message'],
            ['platform', 'household_settings'],
            ['energy', 'energy_log'],
            ['soul', 'gratitude'],
            ['growth', 'income_lever'],
            ['growth', 'income_milestone'],
        ];

        for (const [schema, table] of moves) {
            this.addSql(`alter table if exists "${schema}"."${table}" set schema "public";`);
        }

        for (const schema of ['money', 'platform', 'energy', 'soul', 'growth']) {
            this.addSql(`drop schema if exists "${schema}" cascade;`);
        }
    }

    override async down(): Promise<void> {
        for (const schema of ['money', 'platform', 'energy', 'soul', 'growth']) {
            this.addSql(`create schema if not exists "${schema}";`);
        }

        const restores: Array<[string, string]> = [
            ['bank_account', 'money'],
            ['debt', 'money'],
            ['income_source', 'money'],
            ['jar', 'money'],
            ['goal', 'money'],
            ['category', 'money'],
            ['fixed_cost', 'money'],
            ['period_turn', 'money'],
            ['rule', 'money'],
            ['transaction', 'money'],
            ['turn_event', 'money'],
            ['weekly_ritual', 'money'],
            ['ritual_allocation', 'money'],
            ['coach_message', 'platform'],
            ['household_settings', 'platform'],
            ['energy_log', 'energy'],
            ['gratitude', 'soul'],
            ['income_lever', 'growth'],
            ['income_milestone', 'growth'],
        ];

        for (const [table, schema] of restores) {
            this.addSql(`alter table if exists "public"."${table}" set schema "${schema}";`);
        }
    }
}
