import { Migration } from '@mikro-orm/migrations';

/**
 * Drop orphan Postgres enum types left after household settings moved
 * incomeRhythm / payoffStrategy into jsonb moneySettings.
 */
export class Migration20260905190000_DropOrphanEnumTypes extends Migration {
    override async up(): Promise<void> {
        this.addSql(`drop type if exists "public"."money_payoff_strategy";`);
        this.addSql(`drop type if exists "public"."platform_income_rhythm";`);
    }

    override async down(): Promise<void> {
        this.addSql(`
            do $$ begin
                create type "public"."money_payoff_strategy" as enum ('AVALANCHE', 'SNOWBALL');
            exception when duplicate_object then null;
            end $$;
        `);
        this.addSql(`
            do $$ begin
                create type "public"."platform_income_rhythm" as enum ('STABLE', 'VARIABLE');
            exception when duplicate_object then null;
            end $$;
        `);
    }
}
