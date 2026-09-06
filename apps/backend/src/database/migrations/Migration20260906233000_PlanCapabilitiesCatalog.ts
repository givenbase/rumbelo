import { Migration } from '@mikro-orm/migrations';

/**
 * Normalized capability catalog + plan↔featureKey grants.
 * Mirrors contracts CAPABILITY_CATALOG / PLAN_ACCESS.
 */
export class Migration20260906233000_PlanCapabilitiesCatalog extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `do $$ begin
                create type "backoffice_capability_kind" as enum ('screen', 'action');
            exception when duplicate_object then null;
            end $$;`
        );

        this.addSql(`
            create table if not exists "backoffice"."capability" (
                "id" uuid not null,
                "created_at" timestamptz not null default now(),
                "updated_at" timestamptz not null default now(),
                "key" varchar(64) not null,
                "product" varchar(32) not null,
                "feature" varchar(64) not null,
                "name" varchar(120) not null,
                "description" text not null,
                "sort_order" int not null default 0,
                "is_active" boolean not null default true,
                "kind" "backoffice_capability_kind" not null,
                constraint "capability_pkey" primary key ("id")
            );
        `);
        this.addSql(`
            do $$ begin
                alter table "backoffice"."capability"
                    add constraint "capability_key_unique" unique ("key");
            exception when duplicate_object then null;
            end $$;
        `);
        this.addSql(
            `create index if not exists "capability_product_index" on "backoffice"."capability" ("product");`
        );

        this.addSql(`
            create table if not exists "backoffice"."plan_capability" (
                "id" uuid not null,
                "created_at" timestamptz not null default now(),
                "updated_at" timestamptz not null default now(),
                "plan_key" "backoffice_plan_key" not null,
                "plan_id" uuid not null,
                "capability_id" uuid not null,
                constraint "plan_capability_pkey" primary key ("id")
            );
        `);
        this.addSql(`
            do $$ begin
                alter table "backoffice"."plan_capability"
                    add constraint "plan_capability_plan_key_capability_id_unique"
                    unique ("plan_key", "capability_id");
            exception when duplicate_object then null;
            end $$;
        `);
        this.addSql(`
            do $$ begin
                alter table "backoffice"."plan_capability"
                    add constraint "plan_capability_plan_id_foreign"
                    foreign key ("plan_id") references "backoffice"."plan" ("id")
                    on update cascade on delete cascade;
            exception when duplicate_object then null;
            end $$;
        `);
        this.addSql(`
            do $$ begin
                alter table "backoffice"."plan_capability"
                    add constraint "plan_capability_capability_id_foreign"
                    foreign key ("capability_id") references "backoffice"."capability" ("id")
                    on update cascade on delete cascade;
            exception when duplicate_object then null;
            end $$;
        `);
        this.addSql(
            `create index if not exists "plan_capability_plan_key_index" on "backoffice"."plan_capability" ("plan_key");`
        );
    }

    override async down(): Promise<void> {
        this.addSql(`drop table if exists "backoffice"."plan_capability" cascade;`);
        this.addSql(`drop table if exists "backoffice"."capability" cascade;`);
        this.addSql(`drop type if exists "backoffice_capability_kind";`);
    }
}
