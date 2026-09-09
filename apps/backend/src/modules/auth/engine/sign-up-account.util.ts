import type { Pool } from 'pg';
import { v7 as uuidv7 } from 'uuid';

import type { SignUpAccountProfile } from '@rumtelo/contracts';

/**
 * Create `auth.account` for a newly signed-up Better Auth user.
 *
 * Uses the Better Auth pool (`search_path=auth`) so this works inside
 * `databaseHooks` without Nest DI / MikroORM.
 */
export async function insertAccountForSignUp(
    pool: Pool,
    userId: string,
    profile: SignUpAccountProfile | undefined
): Promise<void> {
    await pool.query(
        `insert into account (
            id, created_at, updated_at, user_id,
            first_name, middle_name, last_name, phone, date_of_birth
         ) values (
            $1, now(), now(), $2::uuid,
            $3, $4, $5, $6, $7::date
         )
         on conflict (user_id) do nothing`,
        [
            uuidv7(),
            userId,
            emptyToNull(profile?.firstName),
            emptyToNull(profile?.middleName),
            emptyToNull(profile?.lastName),
            emptyToNull(profile?.phone),
            profile?.dateOfBirth ?? null,
        ]
    );
}

function emptyToNull(value: string | null | undefined): string | null {
    if (value === null || value === undefined) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}
