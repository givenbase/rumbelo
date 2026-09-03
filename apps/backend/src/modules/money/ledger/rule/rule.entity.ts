import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import { HouseholdEntity } from '../../../../common/database/base.entity.js';
import { Category } from '../../plan/jar/category.entity.js';
import { Jar } from '../../plan/jar/jar.entity.js';

export enum RuleField {
    DESCRIPTION = 'DESCRIPTION',
    COUNTERPARTY = 'COUNTERPARTY',
    AMOUNT = 'AMOUNT',
}
export enum RuleMatcher {
    CONTAINS = 'CONTAINS',
    EQUALS = 'EQUALS',
    STARTS_WITH = 'STARTS_WITH',
    REGEX = 'REGEX',
}

/**
 * Auto-sort engine. Rules run in priority order over incoming transactions;
 * first match wins and stamps appliedRuleId so the decision stays auditable.
 */
@Entity({ tableName: 'rule', schema: 'money' })
export class Rule extends HouseholdEntity {
    @Enum(() => RuleField)
    field: RuleField = RuleField.DESCRIPTION;

    @Enum(() => RuleMatcher)
    matcher: RuleMatcher = RuleMatcher.CONTAINS;

    @Property({ length: 200 })
    value!: string;

    @ManyToOne(() => Jar)
    jar!: Jar;

    @ManyToOne(() => Category, { nullable: true })
    category: Category | null = null;

    @Property({ default: 100 })
    priority = 100;

    @Property({ default: true })
    active = true;

    /** Surfaces dead rules the user can prune. */
    @Property({ default: 0 })
    hitCount = 0;
}
