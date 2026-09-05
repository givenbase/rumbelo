import { Entity, Enum, Property, Unique } from '@mikro-orm/core';
import { Cadence, IncomeKind } from '@rumbelo/contracts';

import { BaseEntity } from '../../../../../common/database/base.entity';
import { NativeEnum } from '../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../common/database/entity-config.util';

/**
 * Income Source Preset Entity
 *
 * Suggestion catalog for "New income" — many English names share a coarse
 * IncomeKind (the system type / picker group). No jar; income is household-level.
 *
 * @see money.income_source — household-owned instances
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(
    entityConfig({ schema: 'backoffice', domain: 'reference', tableName: 'income_source_preset' })
)
@Unique({ properties: ['key'] })
export class IncomeSourcePreset extends BaseEntity {
    // ? PROPERTIES
    /** Stable catalog key (e.g. PARTNER_SALARY) — never rename in place. */
    @Property({ length: 64 })
    key!: string;

    /** English name filled into the create form when picked. */
    @Property({ length: 120 })
    name!: string;

    /** Display / seed order within the catalog. */
    @Property({ default: 0 })
    sortOrder = 0;

    /** Soft-disable without deleting historical seed identity. */
    @Property({ default: true })
    isActive = true;

    // ? ENUMS
    /** Maps onto money.income_source.kind; also used to group the picker. */
    @Enum(NativeEnum({ IncomeKind, domain: 'money' }))
    kind!: IncomeKind;

    /** Suggested cadence when creating the household income source. */
    @Enum(NativeEnum({ Cadence, domain: 'money', defaultValue: Cadence.MONTHLY }))
    defaultCadence: Cadence = Cadence.MONTHLY;
}
