import { Migration } from '@mikro-orm/migrations';

/**
 * Rename Better Auth organization table → household (modelName: 'household').
 * SDK still uses organization.*; only the database + our entities say household.
 */
export class Migration20260906093000_RenameOrgToHousehold extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `alter table "auth"."member" drop constraint if exists "member_organization_id_foreign";`
        );
        this.addSql(
            `alter table "auth"."invitation" drop constraint if exists "invitation_organization_id_foreign";`
        );

        this.addSql(`alter table "auth"."organization" rename to "household";`);
        this.addSql(
            `alter table "auth"."household" rename constraint "organization_pkey" to "household_pkey";`
        );
        this.addSql(
            `alter table "auth"."household" rename constraint "organization_slug_unique" to "household_slug_unique";`
        );

        this.addSql(
            `alter table "auth"."member" rename column "organization_id" to "household_id";`
        );
        this.addSql(
            `alter table "auth"."invitation" rename column "organization_id" to "household_id";`
        );
        this.addSql(
            `alter table "auth"."session" rename column "active_organization_id" to "active_household_id";`
        );

        this.addSql(
            `alter table "auth"."member" add constraint "member_household_id_foreign" foreign key ("household_id") references "auth"."household" ("id") on update cascade on delete cascade;`
        );
        this.addSql(
            `alter table "auth"."invitation" add constraint "invitation_household_id_foreign" foreign key ("household_id") references "auth"."household" ("id") on update cascade on delete cascade;`
        );
    }

    override async down(): Promise<void> {
        this.addSql(
            `alter table "auth"."member" drop constraint if exists "member_household_id_foreign";`
        );
        this.addSql(
            `alter table "auth"."invitation" drop constraint if exists "invitation_household_id_foreign";`
        );

        this.addSql(
            `alter table "auth"."member" rename column "household_id" to "organization_id";`
        );
        this.addSql(
            `alter table "auth"."invitation" rename column "household_id" to "organization_id";`
        );
        this.addSql(
            `alter table "auth"."session" rename column "active_household_id" to "active_organization_id";`
        );

        this.addSql(`alter table "auth"."household" rename to "organization";`);
        this.addSql(
            `alter table "auth"."organization" rename constraint "household_pkey" to "organization_pkey";`
        );
        this.addSql(
            `alter table "auth"."organization" rename constraint "household_slug_unique" to "organization_slug_unique";`
        );

        this.addSql(
            `alter table "auth"."member" add constraint "member_organization_id_foreign" foreign key ("organization_id") references "auth"."organization" ("id") on update cascade on delete cascade;`
        );
        this.addSql(
            `alter table "auth"."invitation" add constraint "invitation_organization_id_foreign" foreign key ("organization_id") references "auth"."organization" ("id") on update cascade on delete cascade;`
        );
    }
}
