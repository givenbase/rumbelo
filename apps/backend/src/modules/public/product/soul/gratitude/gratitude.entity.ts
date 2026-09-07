import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../../common/database/household.entity';
import { entityConfig } from '../../../../../common/database/entity-config.util';
import { Account } from '../../../../auth/user/account/account.entity';

/**
 * Gratitude Entity
 *
 * Person-attributed household row — who wrote it is {@link Account}, not Better Auth `user`.
 *
 * @see https://mikro-orm.io/docs/defining-entities
 */
@Entity(entityConfig({ schema: 'public', domain: 'soul', tableName: 'gratitude' }))
@Index({ properties: ['household', 'week'] })
export class Gratitude extends HouseholdEntity {
    // ? PROPERTIES
    @Property({ length: 8 })
    week!: string;

    @Property({ length: 280 })
    text!: string;

    // ? RELATIONSHIPS
    /**
     * Authoring person (`auth.account`). mapToPk keeps `account: string` in app code.
     * Cascades when the account is deleted.
     */
    @ManyToOne(() => Account, {
        mapToPk: true,
        fieldName: 'account_id',
        deleteRule: 'cascade',
    })
    account!: string;
}
