import { Entity, Property, Unique } from '@mikro-orm/core';
import type { MoneyCharacter } from '@rumbelo/contracts';

import { BaseEntity } from '../../../../../../common/database/base.entity';
import { entityConfig } from '../../../../../../common/database/entity-config.util';

/**
 * Growth Lever Preset Entity
 *
 * Rumbelo-owned catalog of earning methods / levers shown on Growth → Income.
 * Tags use catalog keys (posture / wealth stage) so taxonomies scale without enums.
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'backoffice', domain: 'reference', group: 'growth', tableName: 'lever_preset' }))
@Unique({ properties: ['key'] })
export class LeverPreset extends BaseEntity {
    // ? PROPERTIES
    @Property({ length: 64 })
    key!: string;

    @Property({ length: 120 })
    name!: string;

    @Property({ type: 'text' })
    summary!: string;

    /** CSS color token (e.g. var(--color-accent)). */
    @Property({ length: 64 })
    accentColor!: string;

    @Property({ default: 0 })
    sortOrder = 0;

    /** Empty = show for every posture. Keys → reference_growth_income_posture.key */
    @Property({ type: 'json', default: [] })
    forPostureKeys: string[] = [];

    /** Empty = show for every money character. */
    @Property({ type: 'json', default: [] })
    forCharacters: MoneyCharacter[] = [];

    /** Lowest wealth stage key that should see this lever. */
    @Property({ length: 64, default: 'BUILDING' })
    minStageKey = 'BUILDING';

    @Property({ default: true })
    isActive = true;
}
