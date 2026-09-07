import { Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';

import type { MonthScoreEvent } from './month-score-event.entity';

import { HouseholdEntity } from '../../../../../common/database/household.entity';
import { entityConfig } from '../../../../../common/database/entity-config.util';

/**
 * One budget period's month score. Closing is irreversible by design — the log
 * is the household's honest history, not a scoreboard to replay.
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'month_score' }))
@Unique({ properties: ['household', 'period'] })
export class MonthScore extends HouseholdEntity {
    // ? PROPERTIES
    /** YYYY-MM */
    @Property({ length: 7 })
    period!: string;

    @Property({ default: 0 })
    score = 0;

    @Property({ default: 0 })
    maxScore = 0;

    @Property({ default: 1 })
    level = 1;

    @Property({ default: false })
    isClosed = false;

    @Property({ type: 'timestamptz', nullable: true })
    closedAt: Date | null = null;

    // ? RELATIONSHIPS
    @OneToMany('MonthScoreEvent', 'monthScore')
    events = new Collection<MonthScoreEvent>(this);
}
