import { Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core';
import { MonthScoreEventKind } from '@rumtelo/contracts';

import { HouseholdEntity } from '../../../../../common/database/household.entity';
import { NativeEnum } from '../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../common/database/entity-config.util';
import { MonthScore } from './month-score.entity';

/**
 * MonthScoreEvent Entity
 *
 * Points logged against a period's month score (jar held, week check done, etc.).
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'month_score_event' }))
@Index({ properties: ['household', 'period'] })
export class MonthScoreEvent extends HouseholdEntity {
    // ? PROPERTIES
    @Property({ length: 7 })
    period!: string;

    @Property()
    day!: number;

    @Property({ length: 240 })
    text!: string;

    @Property({ default: 0 })
    points = 0;

    // ? ENUMS
    @Enum(NativeEnum({ MonthScoreEventKind, domain: 'money' }))
    kind!: MonthScoreEventKind;

    // ? RELATIONSHIPS
    @ManyToOne(() => MonthScore, { deleteRule: 'cascade' })
    monthScore!: MonthScore;
}
