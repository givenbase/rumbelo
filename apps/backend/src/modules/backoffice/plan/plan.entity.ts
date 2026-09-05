import { Entity, Enum, Property, Unique } from '@mikro-orm/core';
import { PlanKey } from '@rumbelo/contracts';

import { BaseEntity } from '../../../common/database/base.entity';
import { NativeEnum } from '../../../common/database/native-enum.util';
import { entityConfig } from '../../../common/database/entity-config.util';

/**
 * Plan Entity
 *
 * Rumbelo-owned product tiers (Grip / Engine / Compound).
 * We write these rows; households only *subscribe* (later) or read for gating.
 *
 * @see product/money/plan — household money split (jars), unrelated
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'backoffice', tableName: 'plan' }))
@Unique({ properties: ['key'] })
export class Plan extends BaseEntity {
    // ? PROPERTIES
    /** Product name shown in UI (Grip, Engine, Compound). */
    @Property({ length: 40 })
    name!: string;

    /** Ascending rank so comparisons stay `rankA < rankB`. */
    @Property({ type: 'int' })
    rank!: number;

    /** List price per month in major units (EUR). Free tier is 0. */
    @Property({ type: 'decimal', precision: 8, scale: 2, default: '0.00' })
    priceMonthly: string = '0.00';

    /**
     * Screen keys that require *this* tier as the minimum
     * (mirrors frontend `SCREEN_MIN` — not cumulative with lower tiers).
     */
    @Property({ type: 'json', default: [] })
    unlocks: string[] = [];

    @Property({ default: 0 })
    sortOrder = 0;

    /** Soft-disable without breaking historical subscriptions that used this key. */
    @Property({ default: true })
    isActive = true;

    // ? ENUMS
    /** Stable tier key — used in gating and billing mapping. */
    @Enum(NativeEnum({ PlanKey, domain: 'backoffice' }))
    key!: PlanKey;
}
