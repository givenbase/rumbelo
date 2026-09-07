import { Migration } from '@mikro-orm/migrations';

/**
 * Product → Feature → Capability hierarchy.
 * Adds plan_product / plan_feature; capability.feature_id FK; drops denormalized strings.
 */
export class Migration20260906234500_PlanProductFeatureHierarchy extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            create table if not exists "backoffice"."plan_product" (
                "id" uuid not null,
                "created_at" timestamptz not null default now(),
                "updated_at" timestamptz not null default now(),
                "key" varchar(32) not null,
                "name" varchar(120) not null,
                "sort_order" int not null default 0,
                "is_active" boolean not null default true,
                constraint "plan_product_pkey" primary key ("id")
            );
        `);
        this.addSql(`
            do $$ begin
                alter table "backoffice"."plan_product"
                    add constraint "plan_product_key_unique" unique ("key");
            exception when duplicate_object then null;
            end $$;
        `);

        this.addSql(`
            create table if not exists "backoffice"."plan_feature" (
                "id" uuid not null,
                "created_at" timestamptz not null default now(),
                "updated_at" timestamptz not null default now(),
                "key" varchar(64) not null,
                "name" varchar(120) not null,
                "description" text not null,
                "sort_order" int not null default 0,
                "is_active" boolean not null default true,
                "product_id" uuid not null,
                constraint "plan_feature_pkey" primary key ("id")
            );
        `);
        this.addSql(`
            do $$ begin
                alter table "backoffice"."plan_feature"
                    add constraint "plan_feature_product_id_key_unique" unique ("product_id", "key");
            exception when duplicate_object then null;
            end $$;
        `);
        this.addSql(`
            do $$ begin
                alter table "backoffice"."plan_feature"
                    add constraint "plan_feature_product_id_foreign"
                    foreign key ("product_id") references "backoffice"."plan_product" ("id")
                    on update cascade on delete cascade;
            exception when duplicate_object then null;
            end $$;
        `);

        this.addSql(`
            alter table "backoffice"."capability"
                add column if not exists "feature_id" uuid null;
        `);

        // Backfill products + features from existing capability product/feature strings
        this.addSql(`
            insert into "backoffice"."plan_product" ("id", "created_at", "updated_at", "key", "name", "sort_order", "is_active")
            select gen_random_uuid(), now(), now(), c.product,
                   initcap(c.product), 0, true
            from (
                select distinct "product" as product from "backoffice"."capability"
            ) c
            where not exists (
                select 1 from "backoffice"."plan_product" p where p."key" = c.product
            );
        `);

        this.addSql(`
            insert into "backoffice"."plan_feature" (
                "id", "created_at", "updated_at", "key", "name", "description", "sort_order", "is_active", "product_id"
            )
            select gen_random_uuid(), now(), now(), c."feature", c."name", c."description", c."sort_order", true, p."id"
            from "backoffice"."capability" c
            join "backoffice"."plan_product" p on p."key" = c."product"
            where not exists (
                select 1 from "backoffice"."plan_feature" f
                where f."product_id" = p."id" and f."key" = c."feature"
            );
        `);

        this.addSql(`
            update "backoffice"."capability" c
            set "feature_id" = f."id"
            from "backoffice"."plan_feature" f
            join "backoffice"."plan_product" p on p."id" = f."product_id"
            where c."feature_id" is null
              and p."key" = c."product"
              and f."key" = c."feature";
        `);

        this.addSql(`
            do $$ begin
                alter table "backoffice"."capability"
                    alter column "feature_id" set not null;
            exception when others then null;
            end $$;
        `);

        this.addSql(`
            do $$ begin
                alter table "backoffice"."capability"
                    add constraint "capability_feature_id_foreign"
                    foreign key ("feature_id") references "backoffice"."plan_feature" ("id")
                    on update cascade on delete cascade;
            exception when duplicate_object then null;
            end $$;
        `);

        this.addSql(`drop index if exists "backoffice"."capability_product_index";`);
        this.addSql(`alter table "backoffice"."capability" drop column if exists "product";`);
        this.addSql(`alter table "backoffice"."capability" drop column if exists "feature";`);
    }

    override async down(): Promise<void> {
        this.addSql(
            `alter table "backoffice"."capability" add column if not exists "product" varchar(32) null;`
        );
        this.addSql(
            `alter table "backoffice"."capability" add column if not exists "feature" varchar(64) null;`
        );
        this.addSql(`
            update "backoffice"."capability" c
            set "product" = p."key", "feature" = f."key"
            from "backoffice"."plan_feature" f
            join "backoffice"."plan_product" p on p."id" = f."product_id"
            where c."feature_id" = f."id";
        `);
        this.addSql(
            `alter table "backoffice"."capability" drop constraint if exists "capability_feature_id_foreign";`
        );
        this.addSql(`alter table "backoffice"."capability" drop column if exists "feature_id";`);
        this.addSql(`drop table if exists "backoffice"."plan_feature" cascade;`);
        this.addSql(`drop table if exists "backoffice"."plan_product" cascade;`);
    }
}
