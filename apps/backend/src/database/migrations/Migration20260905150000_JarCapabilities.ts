import { Migration } from '@mikro-orm/migrations';

/**
 * Replace is_spendable with capabilities jsonb on jar templates + household jars.
 */
export class Migration20260905150000_JarCapabilities extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            alter table "backoffice"."reference_jar_template"
            add column if not exists "capabilities" jsonb not null default '{}'::jsonb;
        `);
        this.addSql(`
            alter table "public"."money_jar"
            add column if not exists "capabilities" jsonb not null default '{}'::jsonb;
        `);

        // Template defaults by key
        this.addSql(`
            update "backoffice"."reference_jar_template"
            set "capabilities" = case "key"::text
                when 'FINANCIAL_FREEDOM' then '{"canSpend":false,"canSave":false,"canInvest":true,"countsTowardSafeToSpend":false}'::jsonb
                when 'LONG_TERM_SAVINGS' then '{"canSpend":true,"canSave":true,"canInvest":false,"countsTowardSafeToSpend":false}'::jsonb
                when 'EDUCATION' then '{"canSpend":true,"canSave":true,"canInvest":false,"countsTowardSafeToSpend":true}'::jsonb
                else '{"canSpend":true,"canSave":false,"canInvest":false,"countsTowardSafeToSpend":true}'::jsonb
            end;
        `);

        // Prefer key-based catalog defaults; fall back to old is_spendable for canSpend
        this.addSql(`
            update "public"."money_jar"
            set "capabilities" = case "key"::text
                when 'FINANCIAL_FREEDOM' then '{"canSpend":false,"canSave":false,"canInvest":true,"countsTowardSafeToSpend":false}'::jsonb
                when 'LONG_TERM_SAVINGS' then '{"canSpend":true,"canSave":true,"canInvest":false,"countsTowardSafeToSpend":false}'::jsonb
                when 'EDUCATION' then '{"canSpend":true,"canSave":true,"canInvest":false,"countsTowardSafeToSpend":true}'::jsonb
                else jsonb_build_object(
                    'canSpend', coalesce("is_spendable", true),
                    'canSave', false,
                    'canInvest', false,
                    'countsTowardSafeToSpend', coalesce("is_spendable", true)
                )
            end;
        `);

        this.addSql(`
            alter table "backoffice"."reference_jar_template"
            drop column if exists "is_spendable";
        `);
        this.addSql(`
            alter table "public"."money_jar"
            drop column if exists "is_spendable";
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "backoffice"."reference_jar_template"
            add column if not exists "is_spendable" boolean not null default true;
        `);
        this.addSql(`
            alter table "public"."money_jar"
            add column if not exists "is_spendable" boolean not null default true;
        `);

        this.addSql(`
            update "backoffice"."reference_jar_template"
            set "is_spendable" = coalesce(("capabilities"->>'canSpend')::boolean, true);
        `);
        this.addSql(`
            update "public"."money_jar"
            set "is_spendable" = coalesce(("capabilities"->>'canSpend')::boolean, true);
        `);

        this.addSql(`
            alter table "backoffice"."reference_jar_template"
            drop column if exists "capabilities";
        `);
        this.addSql(`
            alter table "public"."money_jar"
            drop column if exists "capabilities";
        `);
    }
}
