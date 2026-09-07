import { Migration } from '@mikro-orm/migrations';

/**
 * Person-scoped Joyride / Help tour progress on account settings
 * (survives devices and cleared site data — not localStorage).
 */
export class Migration20260907120000_AccountTourProgress extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            alter table "auth"."account_settings"
                add column if not exists "tour" jsonb not null default '{"offer":"idle","tours":{},"seriesActive":false,"seriesIndex":0}'::jsonb;
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "auth"."account_settings" drop column if exists "tour";
        `);
    }
}
