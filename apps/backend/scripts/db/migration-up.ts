/**
 * Apply pending MikroORM migrations without the `@mikro-orm/cli` binary.
 *
 * The CLI pulls in `@jercle/yargonaut`, which crashes on Node 22.22.3+ when
 * loaded via `NODE_OPTIONS=--import tsx/esm` (`require.cache` is undefined).
 * Running through `tsx` + the ORM API avoids that path (Galighticus-compatible).
 *
 * Usage: pnpm db:push  →  tsx scripts/db/migration-up.ts
 */
import { MikroORM } from '@mikro-orm/postgresql';

import config from '../../mikro-orm.config';

async function main() {
    const orm = await MikroORM.init(config);
    try {
        const migrator = orm.getMigrator();
        const pending = await migrator.getPendingMigrations();
        if (pending.length === 0) {
            console.log('No pending migrations.');
            return;
        }
        console.log(`Applying ${pending.length} migration(s)…`);
        const executed = await migrator.up();
        for (const m of executed) {
            console.log(`  ✓ ${m.name}`);
        }
        console.log(`Done. Applied ${executed.length} migration(s).`);
    } finally {
        await orm.close(true);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
