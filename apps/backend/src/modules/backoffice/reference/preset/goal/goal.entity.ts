import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';

import { BaseEntity } from '../../../../../common/database/base.entity';
import { entityConfig } from '../../../../../common/database/entity-config.util';
import { JarTemplate } from '../../template/jar/jar.entity';

/**
 * Goal Preset Entity
 *
 * Suggestion catalog for “New goal” — name + default jar template (+ icon).
 * Households copy into money.goal; jar is resolved by jarTemplate.key.
 *
 * @see JarTemplate — default savings / education jar
 * @see money.goal — household-owned instances
 */
@Entity(entityConfig({ schema: 'backoffice', domain: 'reference', tableName: 'goal_preset' }))
@Unique({ properties: ['key'] })
export class GoalPreset extends BaseEntity {
    // ? PROPERTIES

    /** Stable catalog key (e.g. EMERGENCY_FUND) — never rename in place. */
    @Property({ length: 64 })
    key!: string;

    /** English name filled into the create form when picked. */
    @Property({ length: 120 })
    name!: string;

    /** Default jar template; app resolves household jar by jarTemplate.key. */
    @ManyToOne(() => JarTemplate, { deleteRule: 'restrict' })
    jarTemplate!: JarTemplate;

    /** Optional CategoryTemplate.key hint under that jar (goals may stay uncategorized). */
    @Property({ length: 64, nullable: true })
    categoryTemplateKey: string | null = null;

    /** Optional emoji / short icon for the goal create form. */
    @Property({ length: 8, nullable: true })
    icon: string | null = null;

    /** Display / seed order within the catalog. */
    @Property({ default: 0 })
    sortOrder = 0;

    /** Soft-disable without deleting historical seed identity. */
    @Property({ default: true })
    active = true;
}
