import { Migration } from '@mikro-orm/migrations';

/**
 * Scaffold growth / energy / soul week-check shells.
 * Columns: household + week + completed_at only — product fields come later.
 */
export class Migration20260907250000_PortalWeekCheckShells extends Migration {
    override async up(): Promise<void> {
        for (const domain of ['growth', 'energy', 'soul'] as const) {
            const table = `${domain}_week_check`;
            this.addSql(`
                create table "public"."${table}" (
                    "id" uuid not null,
                    "created_at" timestamptz not null default now(),
                    "updated_at" timestamptz not null default now(),
                    "household_id" uuid not null,
                    "week" varchar(8) not null,
                    "completed_at" timestamptz null,
                    constraint "${table}_pkey" primary key ("id")
                );
            `);
            this.addSql(
                `create index "${table}_household_id_index" on "public"."${table}" ("household_id");`
            );
            this.addSql(
                `alter table "public"."${table}" add constraint "${table}_household_id_week_unique" unique ("household_id", "week");`
            );
            this.addSql(`
                alter table "public"."${table}"
                    add constraint "${table}_household_id_foreign"
                    foreign key ("household_id") references "auth"."household" ("id")
                    on update cascade on delete cascade;
            `);
        }
    }

    override async down(): Promise<void> {
        for (const domain of ['soul', 'energy', 'growth'] as const) {
            const table = `${domain}_week_check`;
            this.addSql(`drop table if exists "public"."${table}" cascade;`);
        }
    }
}
