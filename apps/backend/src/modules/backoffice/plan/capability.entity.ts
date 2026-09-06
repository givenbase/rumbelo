import { Collection, Entity, Enum, OneToMany, Property, Unique } from '@mikro-orm/core';
import { CapabilityKind } from '@rumbelo/contracts';

import { BaseEntity } from '../../../common/database/base.entity';
import { NativeEnum } from '../../../common/database/native-enum.util';
import { entityConfig } from '../../../common/database/entity-config.util';

import type { PlanCapability } from './plan-capability.entity';

/**
 * Capability catalog — one row per featureKey (`{product}-{feature}`).
 * Source of truth: contracts CAPABILITIES + CAPABILITY_CATALOG.
 * Seed: seed/capability.seed-data.ts
 *
 * @see PlanCapability — which plans grant this key
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'backoffice', tableName: 'capability' }))
@Unique({ properties: ['key'] })
export class Capability extends BaseEntity {
    // ? PROPERTIES
    /** Full featureKey — e.g. money-debt, growth-goals (never rename in place). */
    @Property({ length: 64 })
    key!: string;

    /** Label shown in catalog / plan comparison. */
    @Property({ length: 120 })
    name!: string;

    /** Short explanation for Settings / upgrade copy. */
    @Property({ type: 'text' })
    description!: string;

    /** Product segment of the key — money | growth | energy | soul | platform. */
    @Property({ length: 32 })
    product!: string;

    /** Feature segment of the key — debt | goals | invite | …. */
    @Property({ length: 64 })
    feature!: string;

    /** Display / seed order. */
    @Property({ default: 0 })
    sortOrder = 0;

    /** Soft-disable without breaking historical grant rows. */
    @Property({ default: true })
    isActive = true;

    // ? ENUMS
    /** screen = route area; action = discrete verb (invite, …). */
    @Enum(NativeEnum({ CapabilityKind, domain: 'backoffice' }))
    kind!: CapabilityKind;

    // ? RELATIONSHIPS
    @OneToMany('PlanCapability', 'capability')
    planGrants = new Collection<PlanCapability>(this);
}
