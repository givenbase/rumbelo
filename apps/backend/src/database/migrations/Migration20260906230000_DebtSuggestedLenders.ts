import { Migration } from '@mikro-orm/migrations';

/**
 * Debt types carry their own lender name chips (suggested_lenders).
 * Drop merchant.for_debt_type_key — merchants stay expense/inbox only.
 */
export class Migration20260906230000_DebtSuggestedLenders extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."reference_money_debt_preset" add column if not exists "suggested_lenders" jsonb not null default '[]';`
        );
        this.addSql(
            `alter table "backoffice"."reference_money_merchant_preset" drop column if exists "for_debt_type_key";`
        );
        // Leftover from the short-lived debt lender experiment (if still present)
        this.addSql(
            `alter table "backoffice"."reference_money_debt_preset" drop column if exists "is_lender";`
        );
        this.addSql(
            `alter table "backoffice"."reference_money_debt_preset" drop column if exists "for_type_key";`
        );
    }

    override async down(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."reference_money_merchant_preset" add column "for_debt_type_key" varchar(64) null;`
        );
        this.addSql(
            `alter table "backoffice"."reference_money_debt_preset" drop column if exists "suggested_lenders";`
        );
    }
}
