import { Migration } from '@mikro-orm/migrations';

/** Stable source tag for Transaction In presets (analytics-ready; Out stays null). */
export class Migration20260908120000_TransactionInflowKey extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            alter table "money_transaction"
            add column "inflow_key" varchar(64) null;
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "money_transaction"
            drop column "inflow_key";
        `);
    }
}
