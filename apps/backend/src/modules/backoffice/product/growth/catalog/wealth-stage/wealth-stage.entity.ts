import { Entity, Property, Unique } from '@mikro-orm/core';

import { BaseEntity } from '../../../../../../common/database/base.entity';
import { entityConfig } from '../../../../../../common/database/entity-config.util';

/**
 * Wealth Stage catalog — independence band from net worth / progress.
 * Scalable rows (not a Postgres enum). sortOrder is the progression ladder.
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(
    entityConfig({
        schema: 'backoffice',
        domain: 'reference',
        group: 'growth',
        tableName: 'wealth_stage',
    })
)
@Unique({ properties: ['key'] })
export class WealthStage extends BaseEntity {
    // ? PROPERTIES
    @Property({ length: 64 })
    key!: string;

    @Property({ length: 120 })
    name!: string;

    @Property({ type: 'text', nullable: true })
    summary: string | null = null;

    /** Optional UI badge — marketing copy, not a legal claim. */
    @Property({ length: 64, nullable: true })
    badgeLabel: string | null = null;

    /** Net worth floor in eurocents for later auto-detect; null = manual / unset. */
    @Property({ type: 'bigint', nullable: true })
    minNetWorth: number | null = null;

    @Property({ default: 0 })
    sortOrder = 0;

    @Property({ default: true })
    isActive = true;
}
