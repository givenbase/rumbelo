import { Migration } from '@mikro-orm/migrations';

/**
 * Structured person profile on auth.account (legal names + DOB).
 * Better Auth user.name remains the display name.
 */
export class Migration20260906070000_AccountProfile extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `alter table "auth"."account" add column "first_name" varchar(80) null, add column "middle_name" varchar(80) null, add column "last_name" varchar(80) null, add column "date_of_birth" date null;`
        );
    }

    override async down(): Promise<void> {
        this.addSql(
            `alter table "auth"."account" drop column "first_name", drop column "middle_name", drop column "last_name", drop column "date_of_birth";`
        );
    }
}
