import { z } from 'zod';

import { RuleField, RuleMatcher } from '../../../../enums';
import { HouseholdId, Id } from '../../../../common/schemas';

export { RuleField, RuleMatcher } from '../../../../enums';

/**
 * The auto-sort engine. Rules run in priority order on every incoming transaction;
 * first match wins and stamps appliedRuleId so the decision stays auditable.
 */
export const Rule = z.object({
    id: Id,
    householdId: HouseholdId,
    field: z.enum(RuleField),
    matcher: z.enum(RuleMatcher),
    value: z.string().min(1).max(200),
    jarId: Id,
    categoryId: Id.nullable(),
    priority: z.int(),
    isActive: z.boolean().default(true),
    /** How many transactions this rule has sorted — surfaces dead rules. */
    hitCount: z.int(),
});
export type Rule = z.infer<typeof Rule>;
