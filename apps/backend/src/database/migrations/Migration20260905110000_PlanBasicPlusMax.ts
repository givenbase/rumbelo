import { Migration } from '@mikro-orm/migrations';

/**
 * Plan keys: GRIP/RITME/GROEI → BASIC/PLUS/MAX.
 * Adds platform.household_settings.plan_key (default BASIC).
 */
export class Migration20260905110000_PlanBasicPlusMax extends Migration {
    override async up(): Promise<void> {
        // Rename enum values in place (PG 10+)
        this.addSql(`alter type "public"."backoffice_plan_key" rename value 'GRIP' to 'BASIC';`);
        this.addSql(`alter type "public"."backoffice_plan_key" rename value 'RITME' to 'PLUS';`);
        this.addSql(`alter type "public"."backoffice_plan_key" rename value 'GROEI' to 'MAX';`);

        this.addSql(
            `update "backoffice"."plan" set "name" = 'Basic' where "key" = 'BASIC';`
        );
        this.addSql(`update "backoffice"."plan" set "name" = 'Plus' where "key" = 'PLUS';`);
        this.addSql(`update "backoffice"."plan" set "name" = 'Max' where "key" = 'MAX';`);

        this.addSql(`
            alter table "public"."platform_household_settings"
            add column if not exists "plan_key" "public"."backoffice_plan_key" not null default 'BASIC';
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "public"."platform_household_settings"
            drop column if exists "plan_key";
        `);

        this.addSql(`alter type "public"."backoffice_plan_key" rename value 'BASIC' to 'GRIP';`);
        this.addSql(`alter type "public"."backoffice_plan_key" rename value 'PLUS' to 'RITME';`);
        this.addSql(`alter type "public"."backoffice_plan_key" rename value 'MAX' to 'GROEI';`);

        this.addSql(`update "backoffice"."plan" set "name" = 'Grip' where "key" = 'GRIP';`);
        this.addSql(`update "backoffice"."plan" set "name" = 'Engine' where "key" = 'RITME';`);
        this.addSql(`update "backoffice"."plan" set "name" = 'Compound' where "key" = 'GROEI';`);
    }
}
