import { Migration } from '@mikro-orm/migrations';

/**
 * Scalable growth taxonomies: reference_income_posture + reference_wealth_stage.
 * Lever presets retarget to catalog keys; drop frozen growth_wealth_stage enum.
 */
export class Migration20260905170000_GrowthPostureStageCatalogs extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            create table if not exists "backoffice"."reference_income_posture" (
                "id" uuid not null,
                "created_at" timestamptz not null default now(),
                "updated_at" timestamptz not null default now(),
                "key" varchar(64) not null,
                "name" varchar(120) not null,
                "summary" text null,
                "sort_order" int not null default 0,
                "is_active" boolean not null default true,
                constraint "reference_income_posture_pkey" primary key ("id")
            );
        `);
        this.addSql(`
            create unique index if not exists "reference_income_posture_key_unique"
            on "backoffice"."reference_income_posture" ("key");
        `);

        this.addSql(`
            create table if not exists "backoffice"."reference_wealth_stage" (
                "id" uuid not null,
                "created_at" timestamptz not null default now(),
                "updated_at" timestamptz not null default now(),
                "key" varchar(64) not null,
                "name" varchar(120) not null,
                "summary" text null,
                "badge_label" varchar(64) null,
                "min_net_worth" bigint null,
                "sort_order" int not null default 0,
                "is_active" boolean not null default true,
                constraint "reference_wealth_stage_pkey" primary key ("id")
            );
        `);
        this.addSql(`
            create unique index if not exists "reference_wealth_stage_key_unique"
            on "backoffice"."reference_wealth_stage" ("key");
        `);

        // Retarget lever presets: catalog keys instead of Postgres enum.
        this.addSql(`
            alter table "backoffice"."reference_lever_preset"
                add column if not exists "min_stage_key" varchar(64) not null default 'BUILDING';
        `);
        this.addSql(`
            do $$ begin
                if exists (
                    select 1 from information_schema.columns
                    where table_schema = 'backoffice'
                      and table_name = 'reference_lever_preset'
                      and column_name = 'min_stage'
                ) then
                    update "backoffice"."reference_lever_preset"
                    set "min_stage_key" = "min_stage"::text;
                    alter table "backoffice"."reference_lever_preset" drop column "min_stage";
                end if;
            end $$;
        `);
        this.addSql(`
            do $$ begin
                if exists (
                    select 1 from information_schema.columns
                    where table_schema = 'backoffice'
                      and table_name = 'reference_lever_preset'
                      and column_name = 'for_postures'
                ) and not exists (
                    select 1 from information_schema.columns
                    where table_schema = 'backoffice'
                      and table_name = 'reference_lever_preset'
                      and column_name = 'for_posture_keys'
                ) then
                    alter table "backoffice"."reference_lever_preset"
                        rename column "for_postures" to "for_posture_keys";
                elsif not exists (
                    select 1 from information_schema.columns
                    where table_schema = 'backoffice'
                      and table_name = 'reference_lever_preset'
                      and column_name = 'for_posture_keys'
                ) then
                    alter table "backoffice"."reference_lever_preset"
                        add column "for_posture_keys" jsonb not null default '[]';
                end if;
            end $$;
        `);
        this.addSql(`drop type if exists "public"."growth_wealth_stage";`);
    }

    override async down(): Promise<void> {
        this.addSql(`
            do $$ begin
                create type "public"."growth_wealth_stage" as enum (
                    'BUILDING', 'SECURE', 'INDEPENDENT', 'ABUNDANT'
                );
            exception when duplicate_object then null;
            end $$;
        `);
        this.addSql(`
            alter table "backoffice"."reference_lever_preset"
                add column if not exists "min_stage" "public"."growth_wealth_stage" not null default 'BUILDING';
        `);
        this.addSql(`
            update "backoffice"."reference_lever_preset"
            set "min_stage" = "min_stage_key"::"public"."growth_wealth_stage"
            where "min_stage_key" in ('BUILDING', 'SECURE', 'INDEPENDENT', 'ABUNDANT');
        `);
        this.addSql(`
            alter table "backoffice"."reference_lever_preset" drop column if exists "min_stage_key";
        `);
        this.addSql(`
            do $$ begin
                if exists (
                    select 1 from information_schema.columns
                    where table_schema = 'backoffice'
                      and table_name = 'reference_lever_preset'
                      and column_name = 'for_posture_keys'
                ) and not exists (
                    select 1 from information_schema.columns
                    where table_schema = 'backoffice'
                      and table_name = 'reference_lever_preset'
                      and column_name = 'for_postures'
                ) then
                    alter table "backoffice"."reference_lever_preset"
                        rename column "for_posture_keys" to "for_postures";
                end if;
            end $$;
        `);
        this.addSql(`drop table if exists "backoffice"."reference_wealth_stage";`);
        this.addSql(`drop table if exists "backoffice"."reference_income_posture";`);
    }
}
