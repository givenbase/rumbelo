import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { RuleField, RuleMatcher } from '@rumbelo/contracts';

import { HouseholdEntity } from '../../../../../../common/database/base.entity';
import { NativeEnum } from '../../../../../../common/database/native-enum.util';
import { entityConfig } from '../../../../../../common/database/entity-config.util';
import { Category } from '../../plan/jar/category.entity';
import { Jar } from '../../plan/jar/jar.entity';

/**
 * Auto-sort engine. Rules run in priority order over incoming transactions;
 * first match wins and stamps appliedRuleId so the decision stays auditable.
 */
@Entity(entityConfig({ schema: 'public', domain: 'money', tableName: 'rule' }))
export class Rule extends HouseholdEntity {
    @Enum(NativeEnum({ RuleField, domain: 'money', defaultValue: RuleField.DESCRIPTION }))
    field: RuleField = RuleField.DESCRIPTION;

    @Enum(NativeEnum({ RuleMatcher, domain: 'money', defaultValue: RuleMatcher.CONTAINS }))
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
