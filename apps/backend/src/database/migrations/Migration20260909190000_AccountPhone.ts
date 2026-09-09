import { Migration } from '@mikro-orm/migrations';

/**
 * Optional phone on auth.account — application contact fact, not Better Auth login.
 */
export class Migration20260909190000_AccountPhone extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table "auth"."account" add column "phone" varchar(32) null;`);
    }

    override async down(): Promise<void> {
        this.addSql(`alter table "auth"."account" drop column "phone";`);
    }
}
