import { Migration } from '@mikro-orm/migrations';

/** Icons on income source presets (create-form picker, same pattern as debt). */
export class Migration20260908210000_IncomeSourcePresetIcon extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."reference_money_income_source_preset" add column "icon" varchar(32) null;`
        );
    }

    override async down(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."reference_money_income_source_preset" drop column "icon";`
        );
    }
}
