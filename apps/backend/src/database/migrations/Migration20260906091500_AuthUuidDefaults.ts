import { Migration } from '@mikro-orm/migrations';

/**
 * Historical no-op. Previously set `gen_random_uuid()::text` defaults for Better
 * Auth (Option 1). Rumtelo follows Galighticus: Better Auth mints opaque text
 * ids itself — do not let Postgres generate UUIDs for these tables.
 *
 * Defaults already applied on a DB are removed by
 * Migration20260906110000_DropAuthUuidDefaults.
 */
export class Migration20260906091500_AuthUuidDefaults extends Migration {
    override async up(): Promise<void> {
        // no-op
    }

    override async down(): Promise<void> {
        // no-op
    }
}
