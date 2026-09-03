import { Entity, Enum, Index, Property, Unique } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../common/database/base.entity.js';

export enum EnergyMetric {
    SLEEP = 'SLEEP',
    TRAIN = 'TRAIN',
    FOOD = 'FOOD',
    MIND = 'MIND',
}

/**
 * "Energie draagt geld." Tracked because the product claims these are the floor
 * under financial decisions. Correlation with spending is surfaced; causation is
 * never asserted.
 */
@Entity({ tableName: 'energy_log', schema: 'energy' })
@Index({ properties: ['householdId', 'loggedOn'] })
// One reading per metric per user per day; a second entry is a correction, not a new row.
@Unique({ properties: ['userId', 'loggedOn', 'metric'] })
export class EnergyLog extends HouseholdEntity {
    @Property({ type: 'varchar', length: 64 })
    userId!: string;

    @Property({ type: 'date', fieldName: 'logged_on' })
    loggedOn!: string;

    @Enum(() => EnergyMetric)
    metric!: EnergyMetric;

    /** Normalised 0..100 so metrics share one axis. */
    @Property({ type: 'decimal', precision: 5, scale: 2 })
    value!: string;

    @Property({ length: 280, nullable: true })
    note: string | null = null;
}
