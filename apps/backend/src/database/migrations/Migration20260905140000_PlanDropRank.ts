import { Migration } from '@mikro-orm/migrations';

/** Drop redundant plan.rank — sort_order is the single ordering column. */
export class Migration20260905140000_PlanDropRank extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            update "backoffice"."plan" set "sort_order" = "rank"
            where "sort_order" is distinct from "rank";
        `);
        this.addSql(`alter table "backoffice"."plan" drop column if exists "rank";`);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "backoffice"."plan"
            add column if not exists "rank" int not null default 0;
        `);
        this.addSql(`update "backoffice"."plan" set "rank" = "sort_order";`);
    }
}
