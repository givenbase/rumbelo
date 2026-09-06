import { Migration } from '@mikro-orm/migrations';

/**
 * Better Auth Option 1 — let PostgreSQL generate UUID ids
 * (`advanced.database.generateId: false`).
 * @see https://www.better-auth.com/docs/concepts/database#option-1-let-database-generate-ids
 */
export class Migration20260906091500_AuthUuidDefaults extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table "auth"."user" alter column "id" set default gen_random_uuid()::text;`);
        this.addSql(
            `alter table "auth"."session" alter column "id" set default gen_random_uuid()::text;`
        );
        this.addSql(
            `alter table "auth"."organization" alter column "id" set default gen_random_uuid()::text;`
        );
        this.addSql(
            `alter table "auth"."member" alter column "id" set default gen_random_uuid()::text;`
        );
        this.addSql(
            `alter table "auth"."invitation" alter column "id" set default gen_random_uuid()::text;`
        );
        this.addSql(
            `alter table "auth"."verification" alter column "id" set default gen_random_uuid()::text;`
        );
        this.addSql(
            `alter table "auth"."provider" alter column "id" set default gen_random_uuid()::text;`
        );
        this.addSql(
            `alter table "auth"."two_factor" alter column "id" set default gen_random_uuid()::text;`
        );
    }

    override async down(): Promise<void> {
        this.addSql(`alter table "auth"."user" alter column "id" drop default;`);
        this.addSql(`alter table "auth"."session" alter column "id" drop default;`);
        this.addSql(`alter table "auth"."organization" alter column "id" drop default;`);
        this.addSql(`alter table "auth"."member" alter column "id" drop default;`);
        this.addSql(`alter table "auth"."invitation" alter column "id" drop default;`);
        this.addSql(`alter table "auth"."verification" alter column "id" drop default;`);
        this.addSql(`alter table "auth"."provider" alter column "id" drop default;`);
        this.addSql(`alter table "auth"."two_factor" alter column "id" drop default;`);
    }
}
