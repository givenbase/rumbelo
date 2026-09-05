import type { EntityManager } from '@mikro-orm/postgresql';

import { Seeder } from '@mikro-orm/seeder';

import { MerchantPreset } from '../../modules/backoffice/reference/preset/merchant/merchant.entity';
import { MERCHANT_PRESET_SEED } from '../../modules/backoffice/reference/preset/merchant/seed/merchant.seed-data';
import { requireJarTemplate } from '../../modules/backoffice/reference/require-jar-template';

export class MerchantPresetSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        for (const [sortOrder, row] of MERCHANT_PRESET_SEED.entries()) {
            const jarTemplate = await requireJarTemplate(em, row.jarKey);
            const existing = await em.findOne(MerchantPreset, { key: row.key });
            if (existing) {
                existing.name = row.name;
                existing.matchValue = row.matchValue;
                existing.aliases = [...row.aliases];
                existing.mcc = row.mcc;
                existing.jarTemplate = jarTemplate;
                existing.categoryTemplateKey = row.categoryTemplateKey;
                existing.sortOrder = sortOrder;
                existing.active = true;
                continue;
            }
            em.create(MerchantPreset, {
                key: row.key,
                name: row.name,
                matchValue: row.matchValue,
                aliases: [...row.aliases],
                mcc: row.mcc,
                jarTemplate,
                categoryTemplateKey: row.categoryTemplateKey,
                sortOrder,
                active: true,
            } as never);
        }
        await em.flush();
    }
}
