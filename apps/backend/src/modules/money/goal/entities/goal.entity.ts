import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../common/database/base.entity.js';
import { Jar } from '../../jar/entities/index.js';

export enum GoalStatus {
    ACTIVE = 'ACTIVE',
    REACHED = 'REACHED',
    PAUSED = 'PAUSED',
    ARCHIVED = 'ARCHIVED',
}

@Entity({ tableName: 'goal', schema: 'money' })
export class Goal extends HouseholdEntity {
    @ManyToOne(() => Jar, { nullable: true })
    jar: Jar | null = null;

    @Property({ length: 120 })
    name!: string;

    @Property({ length: 8, nullable: true })
    icon: string | null = null;

    @Property({ type: 'bigint' })
    target!: number;

    @Property({ type: 'bigint', default: 0 })
    saved = 0;

    @Property({ type: 'bigint', default: 0 })
    monthlyContribution = 0;

    @Property({ type: 'date', nullable: true })
    targetDate: string | null = null;

    @Enum(() => GoalStatus)
    status: GoalStatus = GoalStatus.ACTIVE;

    @Property({ type: 'text', nullable: true })
    why: string | null = null;
}
