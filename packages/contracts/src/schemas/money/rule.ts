import { z } from 'zod';
import { Id, HouseholdId } from '../common.js';

export const RuleMatcher = z.enum(['CONTAINS', 'EQUALS', 'STARTS_WITH', 'REGEX']);
export const RuleField = z.enum(['DESCRIPTION', 'COUNTERPARTY', 'AMOUNT']);

/**
 * The auto-sort engine. Rules run in priority order on every incoming transaction;
 * first match wins and stamps appliedRuleId so the decision stays auditable.
 */
export const Rule = z.object({
    id: Id,
    householdId: HouseholdId,
    field: RuleField,
    matcher: RuleMatcher,
    value: z.string().min(1).max(200),
    jarId: Id,
    categoryId: Id.nullable(),
    priority: z.int(),
    active: z.boolean().default(true),
    /** How many transactions this rule has sorted — surfaces dead rules. */
    hitCount: z.int(),
});
export type Rule = z.infer<typeof Rule>;
