import { Migration } from '@mikro-orm/migrations';

/**
 * Debt presets split: type rows vs lender rows (who you owe).
 * Lenders optionally bind to a type preset key (e.g. DUO → STUDENT).
 */
export class Migration20260906210000_DebtPresetLenders extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."reference_money_debt_preset" add column "is_lender" boolean not null default false;`
        );
        this.addSql(
            `alter table "backoffice"."reference_money_debt_preset" add column "for_type_key" varchar(64) null;`
        );
    }

    override async down(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."reference_money_debt_preset" drop column "for_type_key";`
        );
        this.addSql(
            `alter table "backoffice"."reference_money_debt_preset" drop column "is_lender";`
        );
    }
}
