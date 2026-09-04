import { Entity, Enum, Property, Unique } from '@mikro-orm/core';

import { BaseEntity } from '../../../../common/database/base.entity';
import { entityConfig } from '../../../../common/database/entity-config.util';
import { JarKey } from '../../../public/product/money/plan/jar/jar.entity';

/**
 * Jar Template Entity
 *
 * Rumbelo-owned catalog for the six jars (name, subtitle, icon, default %).
 * We write these rows; households only copy them into money.jar on onboard.
 *
 * @see money.jar — household-owned instances
 */
@Entity(entityConfig({ schema: 'backoffice', domain: 'reference', tableName: 'jar_template' }))
@Unique({ properties: ['key'] })
export class JarTemplate extends BaseEntity {
    // ? PROPERTIES

    /** Stable key — copied onto household jars; never renamed in place. */
    @Enum(() => JarKey)
    key!: JarKey;

    /** Display name shown at onboard (household may rename their copy later). */
    @Property({ length: 80 })
    name!: string;

    @Property({ length: 160, nullable: true })
    subtitle: string | null = null;

    @Property({ length: 8, nullable: true })
    icon: string | null = null;

    /** Default share of net income (0–100). All active templates should sum to 100. */
    @Property({ type: 'decimal', precision: 5, scale: 2 })
    defaultPercentage!: string;

    /** Financial Freedom is never spendable — enforced when seeding household jars. */
    @Property({ default: true })
    spendable = true;

    @Property({ default: 0 })
    sortOrder = 0;

    /** Soft-disable without deleting historical household jars that used this key. */
    @Property({ default: true })
    active = true;
}
