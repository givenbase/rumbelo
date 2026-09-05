import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

import type { JarKey } from '@rumbelo/contracts';

import { MerchantPreset } from './merchant.entity';

@Injectable()
export class MerchantPresetService {
    constructor(@Inject(EntityManager) private readonly em: EntityManager) {}

    async listActive(filters?: {
        jarKey?: JarKey;
        categoryTemplateKey?: string;
        mcc?: string;
    }): Promise<MerchantPreset[]> {
        return this.em.find(
            MerchantPreset,
            {
                active: true,
                ...(filters?.jarKey ? { jarTemplate: { key: filters.jarKey } } : {}),
                ...(filters?.categoryTemplateKey
                    ? { categoryTemplateKey: filters.categoryTemplateKey }
                    : {}),
                ...(filters?.mcc ? { mcc: filters.mcc } : {}),
            },
            { orderBy: { sortOrder: 'ASC' }, populate: ['jarTemplate'] }
        );
    }

    /**
     * First-pass bank-feed matcher: MCC exact, then case-insensitive CONTAINS
     * on matchValue + aliases against counterparty/description text.
     */
    async matchFeed(input: {
        text?: string | null;
        mcc?: string | null;
    }): Promise<MerchantPreset | null> {
        const active = await this.listActive();
        const mcc = input.mcc?.trim();
        if (mcc) {
            const byMcc = active.find(preset => preset.mcc === mcc);
            if (byMcc) return byMcc;
        }
        const text = (input.text ?? '').trim().toLowerCase();
        if (!text) return null;
        for (const row of active) {
            const needles = [row.matchValue, ...row.aliases]
                .map(alias => alias.trim().toLowerCase())
                .filter(Boolean);
            if (needles.some(needle => text.includes(needle))) return row;
        }
        return null;
    }
}
