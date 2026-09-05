import { Collection, Entity, Enum, OneToMany, Property, Unique } from '@mikro-orm/core';
import { RitualStage } from '@rumbelo/contracts';

import type { RitualAllocation } from './ritual-allocation.entity';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { NativeEnum } from '../../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../../common/database/entity-config.util';

/**
 * The ten-minute weekly ritual: look, redirect, set intention. Three steps on
 * purpose — the product's core claim is that this beats worrying daily.
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'weekly_ritual' }))
@Unique({ properties: ['householdId', 'week'] })
export class WeeklyRitual extends HouseholdEntity {
    // ? PROPERTIES
    /** YYYY-Www */
    @Property({ length: 8 })
    week!: string;

    @Property({ type: 'bigint', default: 0 })
    surplus = 0;

    @Property({ length: 280, nullable: true })
    intention: string | null = null;

    @Property({ type: 'timestamptz', nullable: true })
    completedAt: Date | null = null;

    // ? ENUMS
    @Enum(NativeEnum({ RitualStage, domain: 'money', defaultValue: RitualStage.LOOK }))
    stage: RitualStage = RitualStage.LOOK;

    // ? RELATIONSHIPS
    @OneToMany('RitualAllocation', 'ritual')
    allocations = new Collection<RitualAllocation>(this);
}
