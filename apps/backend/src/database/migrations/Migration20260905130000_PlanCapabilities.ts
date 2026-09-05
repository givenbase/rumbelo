import { Migration } from '@mikro-orm/migrations';

/**
 * Replace plan.unlocks[] with structured capabilities jsonb
 * (maxMembers, householdKinds, screens, canInvite).
 */
export class Migration20260905130000_PlanCapabilities extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            alter table "backoffice"."plan"
            add column if not exists "capabilities" jsonb not null default '{}'::jsonb;
        `);

        this.addSql(`
            update "backoffice"."plan"
            set "capabilities" = case "key"::text
                when 'BASIC' then '{
                    "maxMembers": 1,
                    "householdKinds": ["SOLO"],
                    "screens": [],
                    "canInvite": false
                }'::jsonb
                when 'PLUS' then '{
                    "maxMembers": 5,
                    "householdKinds": ["SOLO","PARTNERS","FAMILY","FRIENDS"],
                    "screens": ["debt","week","goals"],
                    "canInvite": true
                }'::jsonb
                when 'MAX' then '{
                    "maxMembers": null,
                    "householdKinds": ["SOLO","PARTNERS","FAMILY","FRIENDS"],
                    "screens": ["debt","week","goals","income","board","learn","chakra"],
                    "canInvite": true
                }'::jsonb
                else '{
                    "maxMembers": 1,
                    "householdKinds": ["SOLO"],
                    "screens": [],
                    "canInvite": false
                }'::jsonb
            end;
        `);

        this.addSql(`alter table "backoffice"."plan" drop column if exists "unlocks";`);
    }

    override async down(): Promise<void> {
        this.addSql(`
            alter table "backoffice"."plan"
            add column if not exists "unlocks" jsonb not null default '[]'::jsonb;
        `);

        this.addSql(`
            update "backoffice"."plan"
            set "unlocks" = coalesce("capabilities"->'screens', '[]'::jsonb);
        `);

        this.addSql(`alter table "backoffice"."plan" drop column if exists "capabilities";`);
    }
}
