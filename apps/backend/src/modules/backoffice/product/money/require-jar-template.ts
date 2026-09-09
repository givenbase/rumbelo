import type { EntityManager } from '@mikro-orm/postgresql';

import type { JarKey } from '@rumtelo/contracts';
import { JarTemplate } from './template/jar/jar.entity';

/** Resolve a seeded jar template by stable key — throws if catalog not seeded yet. */
export async function requireJarTemplate(em: EntityManager, key: JarKey): Promise<JarTemplate> {
    const row = await em.findOne(JarTemplate, { key });
    if (!row) {
        throw new Error(`JarTemplate missing for key=${key} — run JarTemplateSeeder first`);
    }
    return row;
}

export async function loadJarTemplateMap(em: EntityManager): Promise<Map<JarKey, JarTemplate>> {
    const rows = await em.find(JarTemplate, {});
    return new Map(rows.map(row => [row.key, row]));
}

export function jarTemplateFromMap(map: Map<JarKey, JarTemplate>, key: JarKey): JarTemplate {
    const row = map.get(key);
    if (!row) {
        throw new Error(`JarTemplate missing for key=${key} — run JarTemplateSeeder first`);
    }
    return row;
}
