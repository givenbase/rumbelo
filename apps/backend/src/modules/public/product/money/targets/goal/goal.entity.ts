import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { GoalStatus } from '@rumbelo/contracts';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { NativeEnum } from '../../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../../common/database/entity-config.util';
import { Jar } from '../../plan/jar/jar.entity';

@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'goal' }))
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
    targetOn: string | null = null;

    @Enum(NativeEnum({ GoalStatus, domain: 'money', defaultValue: GoalStatus.ACTIVE }))
    status: GoalStatus = GoalStatus.ACTIVE;

    @Property({ type: 'text', nullable: true })
    why: string | null = null;
}
