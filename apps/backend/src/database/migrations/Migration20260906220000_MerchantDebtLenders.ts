import { Migration } from '@mikro-orm/migrations';

/**
 * Debt lenders live on merchant presets (shared vendor catalog).
 * Drop the short-lived debt_preset lender columns; add for_debt_type_key on merchants.
 */
export class Migration20260906220000_MerchantDebtLenders extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."reference_money_merchant_preset" add column "for_debt_type_key" varchar(64) null;`
        );
        this.addSql(
            `alter table "backoffice"."reference_money_debt_preset" drop column if exists "for_type_key";`
        );
        this.addSql(
            `alter table "backoffice"."reference_money_debt_preset" drop column if exists "is_lender";`
        );
    }

    override async down(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."reference_money_debt_preset" add column "is_lender" boolean not null default false;`
        );
        this.addSql(
            `alter table "backoffice"."reference_money_debt_preset" add column "for_type_key" varchar(64) null;`
        );
        this.addSql(
            `alter table "backoffice"."reference_money_merchant_preset" drop column "for_debt_type_key";`
        );
    }
}
