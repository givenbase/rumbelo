import { Migration } from '@mikro-orm/migrations';

/**
 * Person attribution on energy/gratitude: Better Auth `user_id` → Rumtelo `account_id`.
 *
 * App person FKs point at `auth.account` (BaseEntity uuid), not `auth.user`.
 * Remaps existing rows via `auth.account.user_id`.
 */
export class Migration20260907190000_PersonAccountIdFks extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            alter table "public"."soul_gratitude"
                add column "account_id" uuid null;
        `);
        this.addSql(`
            update "public"."soul_gratitude" as g
            set "account_id" = a."id"
            from "auth"."account" as a
            where a."user_id" = g."user_id";
        `);
        this.addSql(`
            do $$ begin
                if exists (select 1 from "public"."soul_gratitude" where "account_id" is null) then
                    raise exception 'soul_gratitude: cannot remap user_id → account_id (missing auth.account)';
                end if;
            end $$;
        `);
        this.addSql(`
            alter table "public"."soul_gratitude"
                alter column "account_id" set not null;
        `);
        this.addSql(`
            alter table "public"."soul_gratitude"
                drop column "user_id";
        `);
        this.addSql(`
            alter table "public"."soul_gratitude"
                add constraint "soul_gratitude_account_id_foreign"
                foreign key ("account_id") references "auth"."account" ("id")
                on update cascade on delete cascade;
        `);

        this.addSql(`
            alter table "public"."energy_log"
                add column "account_id" uuid null;
        `);
        this.addSql(`
            update "public"."energy_log" as e
            set "account_id" = a."id"
            from "auth"."account" as a
            where a."user_id" = e."user_id";
        `);
        this.addSql(`
            do $$ begin
                if exists (select 1 from "public"."energy_log" where "account_id" is null) then
                    raise exception 'energy_log: cannot remap user_id → account_id (missing auth.account)';
                end if;
            end $$;
        `);
        this.addSql(`
            alter table "public"."energy_log"
                drop constraint "energy_log_user_id_logged_on_metric_unique";
        `);
        this.addSql(`
            alter table "public"."energy_log"
                alter column "account_id" set not null;
        `);
        this.addSql(`
            alter table "public"."energy_log"
                drop column "user_id";
        `);
        this.addSql(`
            alter table "public"."energy_log"
                add constraint "energy_log_account_id_logged_on_metric_unique"
                unique ("account_id", "logged_on", "metric");
        `);
        this.addSql(`
            alter table "public"."energy_log"
                add constraint "energy_log_account_id_foreign"
                foreign key ("account_id") references "auth"."account" ("id")
                on update cascade on delete cascade;
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "public"."soul_gratitude"
                add column "user_id" uuid null;
        `);
        this.addSql(`
            update "public"."soul_gratitude" as g
            set "user_id" = a."user_id"
            from "auth"."account" as a
            where a."id" = g."account_id";
        `);
        this.addSql(`
            alter table "public"."soul_gratitude"
                drop constraint "soul_gratitude_account_id_foreign";
        `);
        this.addSql(`
            alter table "public"."soul_gratitude"
                drop column "account_id";
        `);
        this.addSql(`
            alter table "public"."soul_gratitude"
                alter column "user_id" set not null;
        `);

        this.addSql(`
            alter table "public"."energy_log"
                add column "user_id" uuid null;
        `);
        this.addSql(`
            update "public"."energy_log" as e
            set "user_id" = a."user_id"
            from "auth"."account" as a
            where a."id" = e."account_id";
        `);
        this.addSql(`
            alter table "public"."energy_log"
                drop constraint "energy_log_account_id_foreign";
        `);
        this.addSql(`
            alter table "public"."energy_log"
                drop constraint "energy_log_account_id_logged_on_metric_unique";
        `);
        this.addSql(`
            alter table "public"."energy_log"
                drop column "account_id";
        `);
        this.addSql(`
            alter table "public"."energy_log"
                alter column "user_id" set not null;
        `);
        this.addSql(`
            alter table "public"."energy_log"
                add constraint "energy_log_user_id_logged_on_metric_unique"
                unique ("user_id", "logged_on", "metric");
        `);
    }
}
