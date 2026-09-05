import { Migration } from '@mikro-orm/migrations';

/**
 * Growth lever catalog (backoffice.reference_growth_lever_preset) + growth_wealth_stage enum.
 */
export class Migration20260905160000_GrowthLeverPresets extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            do $$ begin
                create type "public"."growth_wealth_stage" as enum (
                    'BUILDING', 'SECURE', 'INDEPENDENT', 'ABUNDANT'
                );
            exception when duplicate_object then null;
            end $$;
        `);

        this.addSql(`
            create table if not exists "backoffice"."reference_lever_preset" (
                "id" uuid not null,
                "created_at" timestamptz not null default now(),
                "updated_at" timestamptz not null default now(),
                "key" varchar(64) not null,
                "name" varchar(120) not null,
                "summary" text not null,
                "accent_color" varchar(64) not null,
                "for_postures" jsonb not null default '[]',
                "for_characters" jsonb not null default '[]',
                "sort_order" int not null default 0,
                "is_active" boolean not null default true,
                "min_stage" "public"."growth_wealth_stage" not null default 'BUILDING',
                constraint "reference_lever_preset_pkey" primary key ("id")
            );
        `);

        this.addSql(`
            create unique index if not exists "reference_lever_preset_key_unique"
            on "backoffice"."reference_lever_preset" ("key");
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`drop table if exists "backoffice"."reference_lever_preset";`);
        this.addSql(`drop type if exists "public"."growth_wealth_stage";`);
    }
}
