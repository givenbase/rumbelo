import { Migration } from '@mikro-orm/migrations';

/**
 * Align capability keys with product URL slugs (pre-launch, no aliases).
 *
 *   money-transactions → money-spending
 *   energy-train       → energy-training
 *
 * Updates `backoffice.capability.key`, `backoffice.plan_feature.key`,
 * and denormalized `plan.capabilities.capabilityKeys` JSON.
 */
export class Migration20260907260000_SlugCapabilityKeyRename extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
            update "backoffice"."capability"
            set "key" = case "key"
                when 'money-transactions' then 'money-spending'
                when 'energy-train' then 'energy-training'
                else "key"
            end,
            "updated_at" = now()
            where "key" in ('money-transactions', 'energy-train');
        `);

        this.addSql(`
            update "backoffice"."plan_feature"
            set "key" = case "key"
                when 'transactions' then 'spending'
                when 'train' then 'training'
                else "key"
            end,
            "updated_at" = now()
            where "key" in ('transactions', 'train');
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
                                when 'money-transactions' then to_jsonb('money-spending'::text)
                                when 'energy-train' then to_jsonb('energy-training'::text)
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

        this.addSql(`
            update "backoffice"."capability"
            set "name" = 'Spending',
                "description" = 'Manual spending and sorting.',
                "updated_at" = now()
            where "key" = 'money-spending';
        `);
        this.addSql(`
            update "backoffice"."capability"
            set "name" = 'Training',
                "description" = 'Training sessions and load.',
                "updated_at" = now()
            where "key" = 'energy-training';
        `);
        this.addSql(`
            update "backoffice"."capability"
            set "name" = 'Fixed costs',
                "updated_at" = now()
            where "key" = 'money-fixed-costs';
        `);
        this.addSql(`
            update "backoffice"."capability"
            set "name" = 'Gratitude',
                "updated_at" = now()
            where "key" = 'soul-gratitude';
        `);
    }

    override async down(): Promise<void> {
        this.addSql(`
            update "backoffice"."capability"
            set "name" = 'Fixed',
                "updated_at" = now()
            where "key" = 'money-fixed-costs';
        `);
        this.addSql(`
            update "backoffice"."capability"
            set "name" = 'Thanks',
                "updated_at" = now()
            where "key" = 'soul-gratitude';
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
                                when 'money-spending' then to_jsonb('money-transactions'::text)
                                when 'energy-training' then to_jsonb('energy-train'::text)
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

        this.addSql(`
            update "backoffice"."plan_feature"
            set "key" = case "key"
                when 'spending' then 'transactions'
                when 'training' then 'train'
                else "key"
            end,
            "updated_at" = now()
            where "key" in ('spending', 'training');
        `);

        this.addSql(`
            update "backoffice"."capability"
            set "key" = case "key"
                when 'money-spending' then 'money-transactions'
                when 'energy-training' then 'energy-train'
                else "key"
            end,
            "updated_at" = now()
            where "key" in ('money-spending', 'energy-training');
        `);
    }
}
