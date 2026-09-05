import { Migration } from '@mikro-orm/migrations';

/**
 * Replace jar_key enums with FK → reference_jar_template on catalog tables.
 */
export class Migration20260904221500_JarTemplateFk extends Migration {
    override async up(): Promise<void> {
        const tables = [
            'reference_category_template',
            'reference_fixed_cost_preset',
            'reference_goal_preset',
            'reference_merchant_preset',
        ] as const;

        for (const table of tables) {
            this.addSql(
                `alter table "backoffice"."${table}" add column "jar_template_id" uuid null;`
            );
            this.addSql(`
                update "backoffice"."${table}" as t
                set "jar_template_id" = j."id"
                from "backoffice"."reference_jar_template" as j
                where j."key"::text = t."jar_key"::text;
            `);
            this.addSql(
                `alter table "backoffice"."${table}" alter column "jar_template_id" set not null;`
            );
            this.addSql(`
                alter table "backoffice"."${table}"
                add constraint "${table}_jar_template_id_foreign"
                foreign key ("jar_template_id")
                references "backoffice"."reference_jar_template" ("id")
                on update cascade on delete restrict;
            `);
            this.addSql(`alter table "backoffice"."${table}" drop column "jar_key";`);
        }
    }

    override async down(): Promise<void> {
        const tables = [
            'reference_category_template',
            'reference_fixed_cost_preset',
            'reference_goal_preset',
            'reference_merchant_preset',
        ] as const;

        for (const table of tables) {
            this.addSql(`
                alter table "backoffice"."${table}"
                add column "jar_key" text null;
            `);
            this.addSql(`
                update "backoffice"."${table}" as t
                set "jar_key" = j."key"::text
                from "backoffice"."reference_jar_template" as j
                where j."id" = t."jar_template_id";
            `);
            this.addSql(`
                alter table "backoffice"."${table}"
                alter column "jar_key" set not null;
            `);
            this.addSql(`
                alter table "backoffice"."${table}"
                add constraint "${table}_jar_key_check"
                check ("jar_key" in ('NECESSITIES', 'FINANCIAL_FREEDOM', 'EDUCATION', 'LONG_TERM_SAVINGS', 'PLAY', 'GIVE'));
            `);
            this.addSql(
                `alter table "backoffice"."${table}" drop constraint "${table}_jar_template_id_foreign";`
            );
            this.addSql(`alter table "backoffice"."${table}" drop column "jar_template_id";`);
        }
    }
}
