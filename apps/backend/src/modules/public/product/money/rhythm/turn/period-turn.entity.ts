import { Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';

import type { TurnEvent } from './turn-event.entity';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { entityConfig } from '../../../../../../common/database/entity-config.util';

/**
 * One period (month) is one Monopoly turn. Closing is irreversible by design —
 * the log is the user's honest history, not a scoreboard to replay.
 */
@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'period_turn' }))
@Unique({ properties: ['householdId', 'period'] })
export class PeriodTurn extends HouseholdEntity {
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

    @OneToMany('TurnEvent', 'turn')
    events = new Collection<TurnEvent>(this);
}
