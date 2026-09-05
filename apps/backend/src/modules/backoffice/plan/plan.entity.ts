import { Entity, Enum, Property, Unique } from '@mikro-orm/core';
import { PlanKey, type PlanCapabilities } from '@rumbelo/contracts';

import { BaseEntity } from '../../../common/database/base.entity';
import { NativeEnum } from '../../../common/database/native-enum.util';
import { entityConfig } from '../../../common/database/entity-config.util';

/**
 * Plan Entity
 *
 * Rumbelo-owned product tiers (Basic / Plus / Max).
 * We write these rows; households only *subscribe* (later) or read for gating.
 * Runtime checks use PLAN_CAPABILITIES from contracts; this row is the catalog mirror.
 * Display / tier order is `sortOrder` only (0 = Basic …).
 *
 * @see product/money/plan — household money split (jars), unrelated
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'backoffice', tableName: 'plan' }))
@Unique({ properties: ['key'] })
export class Plan extends BaseEntity {
    // ? PROPERTIES
    /** Product name shown in UI (Basic, Plus, Max). */
    @Property({ length: 40 })
    name!: string;

    /** List price per month in major units (EUR). Free tier is 0. */
    @Property({ type: 'decimal', precision: 8, scale: 2, default: '0.00' })
    priceMonthly: string = '0.00';

    /** Ascending tier order — Basic = 0, Plus = 1, Max = 2. */
    @Property({ default: 0 })
    sortOrder = 0;

    /**
     * What this tier can do: member ceiling, household kinds, screens, invites.
     * Mirror of contracts PLAN_CAPABILITIES[key].
     */
    @Property({ type: 'json' })
    capabilities!: PlanCapabilities;

    /** Soft-disable without breaking historical subscriptions that used this key. */
    @Property({ default: true })
    isActive = true;

    // ? ENUMS
    /** Stable tier key — used in gating and billing mapping. */
    @Enum(NativeEnum({ PlanKey, domain: 'backoffice' }))
    key!: PlanKey;
}
