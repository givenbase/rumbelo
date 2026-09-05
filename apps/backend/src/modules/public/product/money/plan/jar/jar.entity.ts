import { Collection, Entity, Enum, OneToMany, Property, Unique } from '@mikro-orm/core';
import { JarKey, type JarCapabilities } from '@rumbelo/contracts';

import type { Category } from './category.entity';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { NativeEnum } from '../../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../../common/database/entity-config.util';

/**
 * Jar Entity
 *
 * Household-owned jar instance. Display defaults + capabilities come from
 * backoffice.reference_money_jar_template at onboard; the household may rename / re-split after.
 *
 * @see JarTemplate
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'jar' }))
@Unique({ properties: ['householdId', 'key'] })
export class Jar extends HouseholdEntity {
    // ? PROPERTIES
    @Property({ length: 80 })
    name!: string;

    @Property({ length: 160, nullable: true })
    subtitle: string | null = null;

    @Property({ length: 8, nullable: true })
    icon: string | null = null;

    /** Share of net income routed here on arrival. Jars must sum to 100 per household. */
    @Property({ type: 'decimal', precision: 5, scale: 2 })
    percentage!: string;

    @Property({ default: 0 })
    sortOrder = 0;

    /**
     * Behavior flags (spend / save / invest / safe-to-spend).
     * Copied from the template at onboard — do not infer from key in services.
     */
    @Property({ type: 'json' })
    capabilities!: JarCapabilities;

    // ? ENUMS
    @Enum(NativeEnum({ JarKey, domain: 'money' }))
    key!: JarKey;

    // ? RELATIONSHIPS
    @OneToMany('Category', 'jar')
    categories = new Collection<Category>(this);
}
