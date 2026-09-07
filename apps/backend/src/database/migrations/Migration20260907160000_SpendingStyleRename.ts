import { Migration } from '@mikro-orm/migrations';

/**
 * Rename money-character columns to spending-style.
 * Enum type rename (`money_character` → `money_spending_style`) is in a later migration.
 */
export class Migration20260907160000_SpendingStyleRename extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            alter table "auth"."account_settings"
            rename column "money_character" to "spending_style";
        `);
        this.addSql(`
            alter table "backoffice"."reference_growth_lever_preset"
            rename column "for_characters" to "for_spending_styles";
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "auth"."account_settings"
            rename column "spending_style" to "money_character";
        `);
        this.addSql(`
            alter table "backoffice"."reference_growth_lever_preset"
            rename column "for_spending_styles" to "for_characters";
        `);
    }
}
