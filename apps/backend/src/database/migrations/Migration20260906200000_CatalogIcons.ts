import { Migration } from '@mikro-orm/migrations';

/**
 * Catalog icons for category templates + debt presets (picker / list visuals).
 */
export class Migration20260906200000_CatalogIcons extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."reference_money_category_template" add column "icon" varchar(8) null;`
        );
        this.addSql(
            `alter table "backoffice"."reference_money_debt_preset" add column "icon" varchar(8) null;`
        );
    }

    override async down(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."reference_money_category_template" drop column "icon";`
        );
        this.addSql(`alter table "backoffice"."reference_money_debt_preset" drop column "icon";`);
    }
}
