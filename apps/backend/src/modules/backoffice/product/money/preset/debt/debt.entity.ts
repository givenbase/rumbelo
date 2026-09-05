import { Entity, Enum, Property, Unique } from '@mikro-orm/core';
import { DebtKind } from '@rumbelo/contracts';

import { BaseEntity } from '../../../../../../common/database/base.entity';
import { NativeEnum } from '../../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../../common/database/entity-config.util';

/**
 * Debt Preset Entity
 *
 * Suggestion catalog for "New debt" — name + DebtKind defaults.
 * Households copy into money.debt; no jar (debts are household-level).
 *
 * @see money.debt — household-owned instances
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'backoffice', domain: 'reference', group: 'money', tableName: 'debt_preset' }))
@Unique({ properties: ['key'] })
export class DebtPreset extends BaseEntity {
    // ? PROPERTIES
    /** Stable catalog key (e.g. STUDENT) — never rename in place. */
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
    /** Maps onto money.debt.kind when the preset is selected. */
    @Enum(NativeEnum({ DebtKind, domain: 'money' }))
    kind!: DebtKind;
}
