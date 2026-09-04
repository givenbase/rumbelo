/**
 * Module-level active household for OpenAPILink headers.
 * AuthProvider writes; createClient headers() reads — no React remount.
 */
let activeHouseholdId: string | null = null;

export function setClientHouseholdId(id: string | null): void {
    activeHouseholdId = id;
}

export function getClientHouseholdHeaders(): Record<string, string> {
    return activeHouseholdId ? { 'x-household-id': activeHouseholdId } : {};
}
