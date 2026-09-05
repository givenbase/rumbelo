import { Entity, Enum, Index, Property } from '@mikro-orm/core';
import { CoachKind } from '@rumbelo/contracts';

import { HouseholdEntity } from '../../../../common/database/base.entity';
import { NativeEnum } from '../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../common/database/entity-config.util';

/**
 * The Coach never scolds — "informatie, nooit schaamte". Every message carries
 * exactly one concrete next move, which is why the CTA travels with it.
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'public', domain: 'platform', tableName: 'coach_message' }))
@Index({ properties: ['householdId', 'period'] })
export class CoachMessage extends HouseholdEntity {
    // ? PROPERTIES
    @Property({ length: 7 })
    period!: string;

    @Property({ type: 'text' })
    text!: string;

    @Property({ length: 60, nullable: true })
    ctaLabel: string | null = null;

    @Property({ length: 200, nullable: true })
    ctaHref: string | null = null;

    @Property({ type: 'timestamptz', nullable: true })
    dismissedAt: Date | null = null;

    // ? ENUMS
    @Enum(NativeEnum({ CoachKind, domain: 'platform', defaultValue: CoachKind.NUDGE }))
    kind: CoachKind = CoachKind.NUDGE;
}
