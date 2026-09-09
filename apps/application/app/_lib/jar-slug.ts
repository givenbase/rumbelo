import { JarKey } from '@rumtelo/contracts';

/** Route slug for jar detail pages — NECESSITIES → necessities. */
export function jarKeyToSlug(key: string): string {
    return key.toLowerCase().replaceAll('_', '-');
}

/** Parse `/jars/[jarKey]` slug back to JarKey enum member. */
export function slugToJarKey(slug: string): JarKey | null {
    const normalised = slug.trim().toUpperCase().replaceAll('-', '_');
    if ((Object.values(JarKey) as string[]).includes(normalised)) {
        return normalised as JarKey;
    }
    return null;
}
