/**
 * Drop Rumbelo schemas (auth, backoffice, public) plus leftover product schemas
 * (money / energy / growth / soul / platform), then recreate public.
 *
 * Non-interactive: pass --yes or DB_DROP_CONFIRM=yes
 *
 * Usage (from apps/backend):
 *   pnpm db:drop -- --yes
 */
import { config as loadDotenv } from 'dotenv';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

const APP_SCHEMAS = ['auth', 'backoffice'] as const;

/** Pre-plane schemas — tables now live in `public`. Always drop on reset. */
const LEGACY_SCHEMAS = ['money', 'energy', 'growth', 'soul', 'platform'] as const;

function findRootEnv(): string {
    let dir = dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 8; i++) {
        const candidate = resolve(dir, '.env');
        if (existsSync(candidate)) return candidate;
        dir = resolve(dir, '..');
    }
    return resolve(dirname(fileURLToPath(import.meta.url)), '../../../.env');
}

loadDotenv({ path: findRootEnv() });

function confirmed(): boolean {
    if (process.argv.includes('--yes') || process.env.DB_DROP_CONFIRM === 'yes') return true;
    if ((process.env.NODE_ENV ?? 'development') === 'development') return true;
    return false;
}

async function main(): Promise<void> {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL is not set');
        process.exit(1);
    }

    if (process.env.NODE_ENV === 'production' && !process.argv.includes('--yes')) {
        console.error('Refusing db:drop in production without --yes');
        process.exit(1);
    }

    if (!confirmed()) {
        console.error('Aborted — pass --yes or set DB_DROP_CONFIRM=yes');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString,
        ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        max: 1,
    });

    const client = await pool.connect();
    try {
        for (const schema of [...APP_SCHEMAS, ...LEGACY_SCHEMAS]) {
            await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
            console.log(`Dropped schema ${schema}`);
        }
        await client.query('DROP SCHEMA IF EXISTS public CASCADE');
        await client.query('CREATE SCHEMA public');
        await client.query('GRANT ALL ON SCHEMA public TO public');
        await client.query('GRANT ALL ON SCHEMA public TO CURRENT_USER');
        console.log('Reset public schema');
        await client.query('DROP TABLE IF EXISTS public.mikro_orm_migrations CASCADE');
        console.log('Cleared mikro_orm_migrations (if present)');
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
