/**
 * Entity Configuration Utility
 *
 * Consistent entity naming: schema + optional domain(/group) table prefix.
 *
 * SCHEMA  = Postgres plane: auth | public | backoffice
 * DOMAIN  = product area under public (or catalog area under backoffice)
 * GROUP   = optional subfolder (e.g. ledger → money_ledger_rule)
 *
 * @example
 *   @Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'jar' }))
 *   // → { tableName: 'money_jar', schema: 'public' }
 *
 * @example
 *   @Entity(entityConfig({ schema: 'backoffice', domain: 'reference', tableName: 'jar_template' }))
 *   // → { tableName: 'reference_jar_template', schema: 'backoffice' }
 */

const VALID_DOMAINS = [
    'money',
    'growth',
    'energy',
    'soul',
    'platform',
    'reference',
    'plan',
    'account',
] as const;

export type EntityDomain = (typeof VALID_DOMAINS)[number];
export type EntitySchema = 'auth' | 'backoffice' | 'public';

interface EntityConfig {
    schema: EntitySchema;
    tableName: string;
}

export interface EntityConfigInput {
    domain?: EntityDomain;
    /** Optional group under domain — mirrors folder segments like ledger, plan. */
    group?: string;
    schema: EntitySchema;
    tableName: string;
}

function validateDomain(domain: string): asserts domain is EntityDomain {
    if (!VALID_DOMAINS.includes(domain as EntityDomain)) {
        throw new Error(
            `Invalid entity domain "${domain}". Must be one of: ${VALID_DOMAINS.join(', ')}`
        );
    }
}

function validateSegment(name: string, label: string): void {
    if (!name || name.trim().length === 0) {
        throw new Error(`${label} cannot be empty`);
    }
    if (!/^[a-z][a-z0-9_]*$/.test(name)) {
        throw new Error(
            `Invalid ${label} "${name}". Must be lowercase, start with letter, use only letters/numbers/underscores.`
        );
    }
}

/** Builds `{domain}_{group?}_{tableName}` table prefix. */
export function buildPrefixedTableName(
    domain: EntityDomain | undefined,
    group: string | undefined,
    tableName: string
): string {
    if (!domain) return tableName;
    return [domain, group, tableName].filter(Boolean).join('_');
}

export function entityConfig(config: EntityConfigInput): EntityConfig {
    const domain = config.domain;
    if (domain) validateDomain(domain);
    if (config.group) validateSegment(config.group, 'group');
    validateSegment(config.tableName, 'table name');

    return {
        schema: config.schema,
        tableName: buildPrefixedTableName(domain, config.group, config.tableName),
    };
}

export function entityConfigExtended(
    config: EntityConfigInput,
    options?: Record<string, unknown>
): EntityConfig & Record<string, unknown> {
    return { ...entityConfig(config), ...options };
}

/** Creates foreign key column name (e.g. 'jar_id'). */
export function fkColumn(entityName: string, suffix = 'id'): string {
    return `${entityName}_${suffix}`;
}

/** Creates join table name for ManyToMany (e.g. 'money_jar_tag_map'). */
export function joinTable(domain: EntityDomain, entityA: string, entityB: string): string {
    validateDomain(domain);
    return `${domain}_${entityA}_${entityB}_map`;
}

/** Creates enum type name (e.g. 'money_jar_key'). */
export function enumType(domain: EntityDomain, name: string): string {
    validateDomain(domain);
    return `${domain}_${name}`;
}
