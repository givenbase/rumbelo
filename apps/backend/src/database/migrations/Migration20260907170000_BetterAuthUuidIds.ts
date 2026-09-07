import { Migration } from '@mikro-orm/migrations';

/**
 * Remap Better Auth opaque text ids → Postgres uuid and align all FKs.
 *
 * Phase 2 decision: **remap** (preserve households/users; sessions remapped).
 * Requires Postgres `uuid` PKs on BA tables; auth.config mints ids via uuidv7.
 *
 * Run after Migration20260907160000_HouseholdSettingsUuidPk.
 */
export class Migration20260907170000_BetterAuthUuidIds extends Migration {
    override async up(): Promise<void> {
        // ── 1. Mapping tables (old text id → new uuid) ─────────────────────
        this.addSql(`
            create temporary table _map_user as
            select id as old_id, gen_random_uuid() as new_id from auth."user";
        `);
        this.addSql(`
            create temporary table _map_household as
            select id as old_id, gen_random_uuid() as new_id from auth.household;
        `);
        this.addSql(`
            create temporary table _map_member as
            select id as old_id, gen_random_uuid() as new_id from auth.member;
        `);
        this.addSql(`
            create temporary table _map_invitation as
            select id as old_id, gen_random_uuid() as new_id from auth.invitation;
        `);
        this.addSql(`
            create temporary table _map_session as
            select id as old_id, gen_random_uuid() as new_id from auth.session;
        `);
        this.addSql(`
            create temporary table _map_provider as
            select id as old_id, gen_random_uuid() as new_id from auth.provider;
        `);
        this.addSql(`
            create temporary table _map_two_factor as
            select id as old_id, gen_random_uuid() as new_id from auth.two_factor;
        `);
        this.addSql(`
            create temporary table _map_verification as
            select id as old_id, gen_random_uuid() as new_id from auth.verification;
        `);

        // ── 2. Drop FKs that reference auth.user / auth.household ───────────
        this.addSql(
            `alter table if exists auth.account drop constraint if exists account_user_id_foreign;`
        );
        this.addSql(
            `alter table if exists auth.session drop constraint if exists session_user_id_foreign;`
        );
        this.addSql(
            `alter table if exists auth.provider drop constraint if exists provider_user_id_foreign;`
        );
        this.addSql(
            `alter table if exists auth.two_factor drop constraint if exists two_factor_user_id_foreign;`
        );
        this.addSql(
            `alter table if exists auth.member drop constraint if exists member_user_id_foreign;`
        );
        this.addSql(
            `alter table if exists auth.member drop constraint if exists member_household_id_foreign;`
        );
        this.addSql(
            `alter table if exists auth.invitation drop constraint if exists invitation_household_id_foreign;`
        );
        this.addSql(
            `alter table if exists auth.invitation drop constraint if exists invitation_inviter_id_foreign;`
        );

        // ── 3. Remap FK columns (still text) ────────────────────────────────
        this.addSql(`
            update auth.account a set user_id = m.new_id::text
            from _map_user m where a.user_id = m.old_id;
        `);
        this.addSql(`
            update auth.session s set user_id = m.new_id::text
            from _map_user m where s.user_id = m.old_id;
        `);
        this.addSql(`
            update auth.session s set active_household_id = m.new_id::text
            from _map_household m where s.active_household_id = m.old_id;
        `);
        this.addSql(`
            update auth.provider p set user_id = m.new_id::text
            from _map_user m where p.user_id = m.old_id;
        `);
        this.addSql(`
            update auth.two_factor t set user_id = m.new_id::text
            from _map_user m where t.user_id = m.old_id;
        `);
        this.addSql(`
            update auth.member mb set user_id = m.new_id::text
            from _map_user m where mb.user_id = m.old_id;
        `);
        this.addSql(`
            update auth.member mb set household_id = m.new_id::text
            from _map_household m where mb.household_id = m.old_id;
        `);
        this.addSql(`
            update auth.invitation i set household_id = m.new_id::text
            from _map_household m where i.household_id = m.old_id;
        `);
        this.addSql(`
            update auth.invitation i set inviter_id = m.new_id::text
            from _map_user m where i.inviter_id = m.old_id;
        `);
        this.addSql(`
            update auth.household_settings hs set household_id = m.new_id::text
            from _map_household m where hs.household_id = m.old_id;
        `);

        // Product / platform tables
        for (const table of [
            'money_jar',
            'money_category',
            'money_transaction',
            'money_rule',
            'money_debt',
            'money_fixed_cost',
            'money_goal',
            'money_income_source',
            'money_income_amount_period',
            'money_bank_account',
            'money_period_turn',
            'money_turn_event',
            'money_weekly_ritual',
            'money_ritual_allocation',
            'growth_lever',
            'growth_milestone',
            'energy_log',
            'soul_gratitude',
            'platform_coach_message',
        ]) {
            this.addSql(`
                update public.${table} t set household_id = m.new_id::text
                from _map_household m where t.household_id = m.old_id;
            `);
        }
        this.addSql(`
            update public.energy_log t set user_id = m.new_id::text
            from _map_user m where t.user_id = m.old_id;
        `);
        this.addSql(`
            update public.soul_gratitude t set user_id = m.new_id::text
            from _map_user m where t.user_id = m.old_id;
        `);

        // ── 4. Remap primary keys ──────────────────────────────────────────
        this.addSql(`
            update auth."user" u set id = m.new_id::text
            from _map_user m where u.id = m.old_id;
        `);
        this.addSql(`
            update auth.household h set id = m.new_id::text
            from _map_household m where h.id = m.old_id;
        `);
        this.addSql(`
            update auth.member mb set id = m.new_id::text
            from _map_member m where mb.id = m.old_id;
        `);
        this.addSql(`
            update auth.invitation i set id = m.new_id::text
            from _map_invitation m where i.id = m.old_id;
        `);
        this.addSql(`
            update auth.session s set id = m.new_id::text
            from _map_session m where s.id = m.old_id;
        `);
        this.addSql(`
            update auth.provider p set id = m.new_id::text
            from _map_provider m where p.id = m.old_id;
        `);
        this.addSql(`
            update auth.two_factor t set id = m.new_id::text
            from _map_two_factor m where t.id = m.old_id;
        `);
        this.addSql(`
            update auth.verification v set id = m.new_id::text
            from _map_verification m where v.id = m.old_id;
        `);

        // ── 5. Alter column types to uuid ──────────────────────────────────
        const authPk = [
            'user',
            'household',
            'member',
            'invitation',
            'session',
            'provider',
            'two_factor',
            'verification',
        ];
        for (const table of authPk) {
            const quoted = table === 'user' ? '"user"' : table;
            this.addSql(`
                alter table auth.${quoted}
                    alter column id type uuid using id::uuid;
            `);
        }

        this.addSql(`
            alter table auth.account
                alter column user_id type uuid using user_id::uuid;
        `);
        this.addSql(`
            alter table auth.session
                alter column user_id type uuid using user_id::uuid;
        `);
        this.addSql(`
            alter table auth.session
                alter column active_household_id type uuid using active_household_id::uuid;
        `);
        this.addSql(`
            alter table auth.provider
                alter column user_id type uuid using user_id::uuid;
        `);
        this.addSql(`
            alter table auth.two_factor
                alter column user_id type uuid using user_id::uuid;
        `);
        this.addSql(`
            alter table auth.member
                alter column user_id type uuid using user_id::uuid,
                alter column household_id type uuid using household_id::uuid;
        `);
        this.addSql(`
            alter table auth.invitation
                alter column household_id type uuid using household_id::uuid,
                alter column inviter_id type uuid using inviter_id::uuid;
        `);
        this.addSql(`
            alter table auth.household_settings
                alter column household_id type uuid using household_id::uuid;
        `);

        for (const table of [
            'money_jar',
            'money_category',
            'money_transaction',
            'money_rule',
            'money_debt',
            'money_fixed_cost',
            'money_goal',
            'money_income_source',
            'money_income_amount_period',
            'money_bank_account',
            'money_period_turn',
            'money_turn_event',
            'money_weekly_ritual',
            'money_ritual_allocation',
            'growth_lever',
            'growth_milestone',
            'energy_log',
            'soul_gratitude',
            'platform_coach_message',
        ]) {
            this.addSql(`
                alter table public.${table}
                    alter column household_id type uuid using household_id::uuid;
            `);
        }
        this.addSql(`
            alter table public.energy_log
                alter column user_id type uuid using user_id::uuid;
        `);
        this.addSql(`
            alter table public.soul_gratitude
                alter column user_id type uuid using user_id::uuid;
        `);

        // ── 6. Recreate FKs ────────────────────────────────────────────────
        this.addSql(`
            alter table auth.account
                add constraint account_user_id_foreign
                foreign key (user_id) references auth."user"(id) on delete cascade;
        `);
        this.addSql(`
            alter table auth.session
                add constraint session_user_id_foreign
                foreign key (user_id) references auth."user"(id) on delete cascade;
        `);
        this.addSql(`
            alter table auth.provider
                add constraint provider_user_id_foreign
                foreign key (user_id) references auth."user"(id) on delete cascade;
        `);
        this.addSql(`
            alter table auth.two_factor
                add constraint two_factor_user_id_foreign
                foreign key (user_id) references auth."user"(id) on delete cascade;
        `);
        this.addSql(`
            alter table auth.member
                add constraint member_user_id_foreign
                foreign key (user_id) references auth."user"(id) on delete cascade;
        `);
        this.addSql(`
            alter table auth.member
                add constraint member_household_id_foreign
                foreign key (household_id) references auth.household(id) on delete cascade;
        `);
        this.addSql(`
            alter table auth.invitation
                add constraint invitation_household_id_foreign
                foreign key (household_id) references auth.household(id) on delete cascade;
        `);
        this.addSql(`
            alter table auth.invitation
                add constraint invitation_inviter_id_foreign
                foreign key (inviter_id) references auth."user"(id) on delete cascade;
        `);
    }

    override async down(): Promise<void> {
        // Irreversible remap — opaque text ids cannot be recovered.
        throw new Error(
            'Migration20260907170000_BetterAuthUuidIds cannot be reversed (ids were remapped).'
        );
    }
}
