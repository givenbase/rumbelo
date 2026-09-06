/** Backoffice product-tier keys (Basic / Plus / Max) — closed commercial set. */

export enum PlanKey {
    BASIC = 'BASIC',
    PLUS = 'PLUS',
    MAX = 'MAX',
}

/**
 * What a capability unlocks in product terms.
 * `screen` = route / nav area; `action` = discrete verb (invite, …).
 */
export enum CapabilityKind {
    SCREEN = 'screen',
    ACTION = 'action',
}
