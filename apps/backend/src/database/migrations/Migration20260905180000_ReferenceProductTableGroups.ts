import { Migration } from '@mikro-orm/migrations';

/**
 * Align backoffice catalog table names with product folders:
 * reference_{money|growth}_{table}.
 */
export class Migration20260905180000_ReferenceProductTableGroups extends Migration {
    override async up(): Promise<void> {
        // Rename referenced parent first (jar template), then dependents.
        const renames: Array<[string, string]> = [
            ['reference_jar_template', 'reference_money_jar_template'],
            ['reference_category_template', 'reference_money_category_template'],
            ['reference_debt_preset', 'reference_money_debt_preset'],
            ['reference_fixed_cost_preset', 'reference_money_fixed_cost_preset'],
            ['reference_goal_preset', 'reference_money_goal_preset'],
            ['reference_income_source_preset', 'reference_money_income_source_preset'],
            ['reference_merchant_preset', 'reference_money_merchant_preset'],
            ['reference_lever_preset', 'reference_growth_lever_preset'],
            ['reference_income_posture', 'reference_growth_income_posture'],
            ['reference_wealth_stage', 'reference_growth_wealth_stage'],
        ];

        for (const [from, to] of renames) {
            this.addSql(`
                do $$ begin
                    if exists (
                        select 1 from information_schema.tables
                        where table_schema = 'backoffice' and table_name = '${from}'
                    ) and not exists (
                        select 1 from information_schema.tables
                        where table_schema = 'backoffice' and table_name = '${to}'
                    ) then
                        alter table "backoffice"."${from}" rename to "${to}";
                    end if;
                end $$;
            `);
            this.addSql(`
                do $$ begin
                    if exists (
                        select 1 from pg_constraint
                        where conname = '${from}_pkey'
                    ) then
                        alter table "backoffice"."${to}" rename constraint "${from}_pkey" to "${to}_pkey";
                    end if;
                exception when undefined_table then null;
                end $$;
            `);
            this.addSql(`
                do $$ begin
                    if exists (
                        select 1 from pg_class c
                        join pg_namespace n on n.oid = c.relnamespace
                        where n.nspname = 'backoffice' and c.relname = '${from}_key_unique'
                    ) then
                        alter index "backoffice"."${from}_key_unique" rename to "${to}_key_unique";
                    end if;
                end $$;
            `);
        }

        // FK constraint names still use pre-rename table prefixes.
        const jarFks: Array<[string, string]> = [
            ['reference_money_category_template', 'reference_category_template'],
            ['reference_money_fixed_cost_preset', 'reference_fixed_cost_preset'],
            ['reference_money_goal_preset', 'reference_goal_preset'],
            ['reference_money_merchant_preset', 'reference_merchant_preset'],
        ];
        for (const [table, legacyPrefix] of jarFks) {
            const legacyFrom = `${legacyPrefix}_jar_template_id_foreign`;
            const newName = `${table}_jar_template_id_foreign`;
            this.addSql(`
                do $$ begin
                    if exists (select 1 from pg_constraint where conname = '${legacyFrom}') then
                        alter table "backoffice"."${table}"
                            rename constraint "${legacyFrom}" to "${newName}";
                    end if;
                end $$;
            `);
        }
    }

    override async down(): Promise<void> {
        const renames: Array<[string, string]> = [
            ['reference_money_jar_template', 'reference_jar_template'],
            ['reference_money_category_template', 'reference_category_template'],
            ['reference_money_debt_preset', 'reference_debt_preset'],
            ['reference_money_fixed_cost_preset', 'reference_fixed_cost_preset'],
            ['reference_money_goal_preset', 'reference_goal_preset'],
            ['reference_money_income_source_preset', 'reference_income_source_preset'],
            ['reference_money_merchant_preset', 'reference_merchant_preset'],
            ['reference_growth_lever_preset', 'reference_lever_preset'],
            ['reference_growth_income_posture', 'reference_income_posture'],
            ['reference_growth_wealth_stage', 'reference_wealth_stage'],
        ];

        for (const [from, to] of renames) {
            this.addSql(`
                do $$ begin
                    if exists (
                        select 1 from information_schema.tables
                        where table_schema = 'backoffice' and table_name = '${from}'
                    ) and not exists (
                        select 1 from information_schema.tables
                        where table_schema = 'backoffice' and table_name = '${to}'
                    ) then
                        alter table "backoffice"."${from}" rename to "${to}";
                    end if;
                end $$;
            `);
            this.addSql(`
                do $$ begin
                    if exists (select 1 from pg_constraint where conname = '${from}_pkey') then
                        alter table "backoffice"."${to}" rename constraint "${from}_pkey" to "${to}_pkey";
                    end if;
                exception when undefined_table then null;
                end $$;
            `);
            this.addSql(`
                do $$ begin
                    if exists (
                        select 1 from pg_class c
                        join pg_namespace n on n.oid = c.relnamespace
                        where n.nspname = 'backoffice' and c.relname = '${from}_key_unique'
                    ) then
                        alter index "backoffice"."${from}_key_unique" rename to "${to}_key_unique";
                    end if;
                end $$;
            `);
        }

        const jarFkTables: Array<[string, string]> = [
            ['reference_category_template', 'reference_money_category_template'],
            ['reference_fixed_cost_preset', 'reference_money_fixed_cost_preset'],
            ['reference_goal_preset', 'reference_money_goal_preset'],
            ['reference_merchant_preset', 'reference_money_merchant_preset'],
        ];
        for (const [legacy, money] of jarFkTables) {
            this.addSql(`
                do $$ begin
                    if exists (
                        select 1 from pg_constraint
                        where conname = '${money}_jar_template_id_foreign'
                    ) then
                        alter table "backoffice"."${legacy}"
                            rename constraint "${money}_jar_template_id_foreign"
                            to "${legacy}_jar_template_id_foreign";
                    end if;
                end $$;
            `);
        }
    }
}
