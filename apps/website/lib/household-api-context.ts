/**
 * Client-only active household for oRPC headers (`x-household-id`).
 * Value is a Better Auth opaque AuthId — not a Rumtelo uuid.
 */
let activeHouseholdId: string | null = null;

export function setClientHouseholdId(id: string | null): void {
    activeHouseholdId = id;
}

export function getClientHouseholdHeaders(): Record<string, string> {
    return activeHouseholdId ? { 'x-household-id': activeHouseholdId } : {};
}
