/**
 * Native enum naming — Postgres enum types live in `public` (or auth/backoffice).
 * Always pass domain when the type name needs a stable prefix.
 */

export type EnumDomain = 'auth' | 'backoffice' | 'energy' | 'growth' | 'money' | 'platform' | 'soul';

/**
 * Converts PascalCase to snake_case, stripping a trailing `Enum` suffix.
 * `JarKey` / `JarKeyEnum` → `jar_key`
 */
export function toSnakeCaseEnumName(name: string): string {
    const trimmed = name.replace(/Enum$/, '');
    return trimmed
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
        .toLowerCase();
}

/** Prefixed enum type name: `money_jar_key`. */
export function nativeEnumType(domain: EnumDomain, name: string): string {
    const base = toSnakeCaseEnumName(name);
    return `${domain}_${base}`;
}
