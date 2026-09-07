import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../../common/database/household.entity';
import { entityConfig } from '../../../../../common/database/entity-config.util';
import { Jar } from '../plan/jar/jar.entity';
import { WeekCheck } from './week-check.entity';

/**
 * Where the week's surplus was redirected.
 *
 * A normalised table rather than a jsonb column on the week check: these rows are
 * queried by jar to answer "how much has this jar received from week checks", they
 * need a real foreign key to Jar so a deleted jar cannot leave orphan references,
 * and they are summed in aggregate queries where jsonb would force a scan.
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'week_check_allocation' }))
@Unique({ properties: ['weekCheck', 'jar'] })
export class WeekCheckAllocation extends HouseholdEntity {
    // ? PROPERTIES
    @Property({ type: 'bigint' })
    amount!: number;

    // ? RELATIONSHIPS
    @ManyToOne(() => WeekCheck, { deleteRule: 'cascade' })
    weekCheck!: WeekCheck;

    @ManyToOne(() => Jar, { deleteRule: 'cascade' })
    jar!: Jar;
}
