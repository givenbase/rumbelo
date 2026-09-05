import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';

import { BaseEntity } from '../../../../../common/database/base.entity';
import { entityConfig } from '../../../../../common/database/entity-config.util';
import { JarTemplate } from '../jar/jar.entity';

/**
 * Category Template Entity
 *
 * Rumbelo-owned spending categories under a jar template (Housing, Groceries, …).
 * Presets reference `key`; households copy `name` into money.category on demand.
 *
 * @see JarTemplate — parent jar in the reference catalog
 * @see money.category — household-owned instances
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'backoffice', domain: 'reference', tableName: 'category_template' }))
@Unique({ properties: ['key'] })
export class CategoryTemplate extends BaseEntity {
    // ? PROPERTIES

    /** Stable key referenced by presets (e.g. HOUSING) — never rename in place. */
    @Property({ length: 64 })
    key!: string;

    /** English display name copied onto household categories when resolving a preset. */
    @Property({ length: 80 })
    name!: string;

    /** Display / seed order within the catalog (and within a jar in pickers). */
    @Property({ default: 0 })
    sortOrder = 0;

    /** Soft-disable without breaking presets that still reference this key. */
    @Property({ default: true })
    isActive = true;

    // ? RELATIONSHIPS

    /** Parent jar in the reference catalog (not a household money.jar row). */
    @ManyToOne(() => JarTemplate, { deleteRule: 'restrict' })
    jarTemplate!: JarTemplate;
}
