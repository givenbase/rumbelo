import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../common/database/base.entity.js';
import { Jar } from '../../plan/jar/jar.entity.js';
import { WeeklyRitual } from './weekly-ritual.entity.js';

/**
 * Where the week's surplus was redirected.
 *
 * A normalised table rather than a jsonb column on the ritual: these rows are
 * queried by jar to answer "how much has this jar received from rituals", they
 * need a real foreign key to Jar so a deleted jar cannot leave orphan references,
 * and they are summed in aggregate queries where jsonb would force a scan.
 */
@Entity({ tableName: 'ritual_allocation', schema: 'money' })
@Unique({ properties: ['ritual', 'jar'] })
export class RitualAllocation extends HouseholdEntity {
    @ManyToOne(() => WeeklyRitual, { deleteRule: 'cascade' })
    ritual!: WeeklyRitual;

    @ManyToOne(() => Jar, { deleteRule: 'cascade' })
    jar!: Jar;

    @Property({ type: 'bigint' })
    amount!: number;
}
