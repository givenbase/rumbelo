import { Entity, Enum, Index, ManyToOne, Property } from '@mikro-orm/core';
import { TurnEventKind } from '@rumbelo/contracts';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { NativeEnum } from '../../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../../common/database/entity-config.util';
import { PeriodTurn } from './period-turn.entity';

@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'turn_event' }))
@Index({ properties: ['householdId', 'period'] })
export class TurnEvent extends HouseholdEntity {
    @ManyToOne(() => PeriodTurn, { deleteRule: 'cascade' })
    turn!: PeriodTurn;

    @Property({ length: 7 })
    period!: string;

    @Enum(NativeEnum({ TurnEventKind, domain: 'money' }))
    kind!: TurnEventKind;

    @Property()
    day!: number;

    @Property({ length: 240 })
    text!: string;

    @Property({ default: 0 })
    points = 0;
}
