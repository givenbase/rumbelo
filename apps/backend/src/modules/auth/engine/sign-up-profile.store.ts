/**
 * Stash sign-up profile fields between Better Auth middleware and user.create.after.
 * Fields are not Better Auth columns — they land on Rumtelo `auth.account`.
 */

import type { SignUpAccountProfile } from '@rumtelo/contracts';

type PendingEntry = {
    profile: SignUpAccountProfile;
    at: number;
};

const TTL_MS = 60_000;
const pendingByEmail = new Map<string, PendingEntry>();

function prune(now = Date.now()): void {
    for (const [email, entry] of pendingByEmail) {
        if (now - entry.at > TTL_MS) pendingByEmail.delete(email);
    }
}

export function stashSignUpAccountProfile(email: string, profile: SignUpAccountProfile): void {
    prune();
    pendingByEmail.set(email.trim().toLowerCase(), { profile, at: Date.now() });
}

export function takeSignUpAccountProfile(email: string): SignUpAccountProfile | undefined {
    const key = email.trim().toLowerCase();
    const entry = pendingByEmail.get(key);
    pendingByEmail.delete(key);
    return entry?.profile;
}
