import { Entity, Enum, Property, Unique } from '@mikro-orm/core';
import { JarKey } from '@rumbelo/contracts';

import { BaseEntity } from '../../../../../common/database/base.entity';
import { NativeEnum } from '../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../common/database/entity-config.util';

/**
 * Jar Template Entity
 *
 * Rumbelo-owned catalog for the six jars (name, subtitle, icon, default %).
 * We write these rows; households only copy them into money.jar on onboard.
 *
 * @see money.jar — household-owned instances
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'backoffice', domain: 'reference', tableName: 'jar_template' }))
@Unique({ properties: ['key'] })
export class JarTemplate extends BaseEntity {
    // ? PROPERTIES
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

    /** Display / seed order within the catalog. */
    @Property({ default: 0 })
    sortOrder = 0;

    /** Financial Freedom is never spendable — enforced when seeding household jars. */
    @Property({ default: true })
    isSpendable = true;

    /** Soft-disable without deleting historical household jars that used this key. */
    @Property({ default: true })
    isActive = true;

    // ? ENUMS
    /** Stable key — copied onto household jars; never renamed in place. */
    @Enum(NativeEnum({ JarKey, domain: 'money' }))
    key!: JarKey;
}
