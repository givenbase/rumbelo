import { Migration } from '@mikro-orm/migrations';

/**
 * Rename capability keys to match current product names (pre-launch, no aliases).
 *
 *   home-ritual   → home-coach
 *   growth-board  → growth-net-worth
 *   soul-mind     → soul-stillness
 *   soul-chakra   → soul-centres
 *
 * Updates `backoffice.capability.key`, `backoffice.plan_feature.key`,
 * and denormalized `plan.capabilities.capabilityKeys` JSON.
 * `plan_capability` joins by capability_id — no string key column.
 */
export class Migration20260907240000_CapabilityKeyRename extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            update "backoffice"."capability"
            set "key" = case "key"
                when 'home-ritual' then 'home-coach'
                when 'growth-board' then 'growth-net-worth'
                when 'soul-mind' then 'soul-stillness'
                when 'soul-chakra' then 'soul-centres'
                else "key"
            end,
            "updated_at" = now()
            where "key" in ('home-ritual', 'growth-board', 'soul-mind', 'soul-chakra');
        `);

        this.addSql(`
            update "backoffice"."plan_feature"
            set "key" = case "key"
                when 'ritual' then 'coach'
                when 'board' then 'net-worth'
                when 'mind' then 'stillness'
                when 'chakra' then 'centres'
                else "key"
            end,
            "updated_at" = now()
            where "key" in ('ritual', 'board', 'mind', 'chakra');
        `);

        this.addSql(`
            update "backoffice"."plan"
            set "capabilities" = jsonb_set(
                "capabilities",
                '{capabilityKeys}',
                coalesce(
                    (
                        select jsonb_agg(
                            case elem #>> '{}'
                                when 'home-ritual' then to_jsonb('home-coach'::text)
                                when 'growth-board' then to_jsonb('growth-net-worth'::text)
                                when 'soul-mind' then to_jsonb('soul-stillness'::text)
                                when 'soul-chakra' then to_jsonb('soul-centres'::text)
                                else elem
                            end
                            order by ordinality
                        )
                        from jsonb_array_elements("capabilities"->'capabilityKeys')
                            with ordinality as t(elem, ordinality)
                    ),
                    '[]'::jsonb
                )
            ),
            "updated_at" = now()
            where "capabilities" ? 'capabilityKeys';
        `);

        // Catalog copy for renamed screens (names already match product; tighten descriptions).
        this.addSql(`
            update "backoffice"."capability"
            set "name" = 'Coach',
                "description" = 'Suggestions across products — week check, month score, and next moves.',
                "updated_at" = now()
            where "key" = 'home-coach';
        `);
        this.addSql(`
            update "backoffice"."capability"
            set "name" = 'Net worth',
                "description" = 'Net worth, returns, and your freedom number.',
                "updated_at" = now()
            where "key" = 'growth-net-worth';
        `);
        this.addSql(`
            update "backoffice"."capability"
            set "name" = 'Stillness',
                "description" = 'Stillness practice and presence.',
                "updated_at" = now()
            where "key" = 'soul-stillness';
        `);
        this.addSql(`
            update "backoffice"."capability"
            set "name" = 'Centres',
                "description" = 'The seven centres and where energy gets stuck.',
                "updated_at" = now()
            where "key" = 'soul-centres';
        `);

        this.addSql(`
            update "backoffice"."plan_feature" f
            set "name" = c."name",
                "description" = c."description",
                "updated_at" = now()
            from "backoffice"."capability" c
            where c."feature_id" = f."id"
              and c."key" in ('home-coach', 'growth-net-worth', 'soul-stillness', 'soul-centres');
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            update "backoffice"."capability"
            set "key" = case "key"
                when 'home-coach' then 'home-ritual'
                when 'growth-net-worth' then 'growth-board'
                when 'soul-stillness' then 'soul-mind'
                when 'soul-centres' then 'soul-chakra'
                else "key"
            end,
            "updated_at" = now()
            where "key" in ('home-coach', 'growth-net-worth', 'soul-stillness', 'soul-centres');
        `);

        this.addSql(`
            update "backoffice"."plan_feature"
            set "key" = case "key"
                when 'coach' then 'ritual'
                when 'net-worth' then 'board'
                when 'stillness' then 'mind'
                when 'centres' then 'chakra'
                else "key"
            end,
            "updated_at" = now()
            where "key" in ('coach', 'net-worth', 'stillness', 'centres');
        `);

        this.addSql(`
            update "backoffice"."plan"
            set "capabilities" = jsonb_set(
                "capabilities",
                '{capabilityKeys}',
                coalesce(
                    (
                        select jsonb_agg(
                            case elem #>> '{}'
                                when 'home-coach' then to_jsonb('home-ritual'::text)
                                when 'growth-net-worth' then to_jsonb('growth-board'::text)
                                when 'soul-stillness' then to_jsonb('soul-mind'::text)
                                when 'soul-centres' then to_jsonb('soul-chakra'::text)
                                else elem
                            end
                            order by ordinality
                        )
                        from jsonb_array_elements("capabilities"->'capabilityKeys')
                            with ordinality as t(elem, ordinality)
                    ),
                    '[]'::jsonb
                )
            ),
            "updated_at" = now()
            where "capabilities" ? 'capabilityKeys';
        `);
    }
}
