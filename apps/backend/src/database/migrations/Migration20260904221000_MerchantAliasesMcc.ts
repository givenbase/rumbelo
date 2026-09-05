import { Migration } from '@mikro-orm/migrations';

/** Merchant presets: aliases[] + optional MCC for bank-feed matching. */
export class Migration20260904221000_MerchantAliasesMcc extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."reference_merchant_preset" add column "aliases" jsonb not null default '[]';`
        );
        this.addSql(
            `alter table "backoffice"."reference_merchant_preset" add column "mcc" varchar(4) null;`
        );
    }

    override async down(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."reference_merchant_preset" drop column "aliases";`
        );
        this.addSql(`alter table "backoffice"."reference_merchant_preset" drop column "mcc";`);
    }
}
