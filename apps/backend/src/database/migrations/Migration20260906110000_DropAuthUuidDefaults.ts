import { Migration } from '@mikro-orm/migrations';

/**
 * Drop Postgres UUID defaults on Better Auth tables.
 *
 * Better Auth owns id generation (opaque text). App rows keep native `uuid`
 * via BaseEntity. FKs (`user_id`, `household_id`) stay text/varchar — they
 * store BA ids, not Rumbelo uuids.
 */
export class Migration20260906110000_DropAuthUuidDefaults extends Migration {
    override async up(): Promise<void> {
        // Table may still be `organization` if RenameOrg has not run yet on
        // some environments; prefer `household` (post-rename) and also clear
        // organization if it exists.
        this.addSql(`alter table if exists "auth"."user" alter column "id" drop default;`);
        this.addSql(`alter table if exists "auth"."session" alter column "id" drop default;`);
        this.addSql(`alter table if exists "auth"."member" alter column "id" drop default;`);
        this.addSql(`alter table if exists "auth"."invitation" alter column "id" drop default;`);
        this.addSql(`alter table if exists "auth"."verification" alter column "id" drop default;`);
        this.addSql(`alter table if exists "auth"."provider" alter column "id" drop default;`);
        this.addSql(`alter table if exists "auth"."two_factor" alter column "id" drop default;`);
        this.addSql(`alter table if exists "auth"."household" alter column "id" drop default;`);
        this.addSql(`alter table if exists "auth"."organization" alter column "id" drop default;`);
    }

    override async down(): Promise<void> {
        // Do not restore UUID defaults — that was the wrong model.
    }
}
