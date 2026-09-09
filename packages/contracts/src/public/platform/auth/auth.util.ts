/**
 * Auth Utils
 * Pure helpers for sign-up display name + account profile seed.
 */

import type { SignUpAccountProfile } from './auth.types';

/**
 * Seed Better Auth `user.name` from legal name parts.
 * Display name stays independently editable in settings afterward.
 */
export function composeDisplayName(
    firstName: string,
    middleName?: string | null,
    lastName?: string | null
): string {
    return [firstName, middleName, lastName]
        .map(part => part?.trim())
        .filter((part): part is string => Boolean(part && part.length > 0))
        .join(' ');
}

function emptyToUndefined(value: string | undefined): string | undefined {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

/** Normalize form / body optionals before writing `auth.account`. */
export function toSignUpAccountProfile(values: {
    firstName: string;
    middleName?: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
}): SignUpAccountProfile {
    return {
        firstName: values.firstName.trim(),
        middleName: emptyToUndefined(values.middleName),
        lastName: values.lastName.trim(),
        phone: emptyToUndefined(values.phone),
        dateOfBirth: emptyToUndefined(values.dateOfBirth),
    };
}
