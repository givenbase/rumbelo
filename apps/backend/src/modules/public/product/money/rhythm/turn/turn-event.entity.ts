import { Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core';
import { TurnEventKind } from '@rumbelo/contracts';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { NativeEnum } from '../../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../../common/database/entity-config.util';
import { PeriodTurn } from './period-turn.entity';

/**
 * TurnEvent Entity
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'turn_event' }))
@Index({ properties: ['householdId', 'period'] })
export class TurnEvent extends HouseholdEntity {
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
    @Enum(NativeEnum({ TurnEventKind, domain: 'money' }))
    kind!: TurnEventKind;

    // ? RELATIONSHIPS
    @ManyToOne(() => PeriodTurn, { deleteRule: 'cascade' })
    turn!: PeriodTurn;
}
