import { Entity, Property, Unique } from '@mikro-orm/core';

import { BaseEntity } from '../../../../../../common/database/base.entity';
import { entityConfig } from '../../../../../../common/database/entity-config.util';

/**
 * Income Posture catalog — how someone primarily earns.
 * Scalable rows (not a Postgres enum): add postures via seed/admin.
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(
    entityConfig({
        schema: 'backoffice',
        domain: 'reference',
        group: 'growth',
        tableName: 'income_posture',
    })
)
@Unique({ properties: ['key'] })
export class IncomePosture extends BaseEntity {
    // ? PROPERTIES
    @Property({ length: 64 })
    key!: string;

    @Property({ length: 120 })
    name!: string;

    @Property({ type: 'text', nullable: true })
    summary: string | null = null;

    @Property({ default: 0 })
    sortOrder = 0;

    @Property({ default: true })
    isActive = true;
}
