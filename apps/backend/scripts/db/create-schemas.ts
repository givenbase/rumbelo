/**
 * Creates PostgreSQL schemas required by Rumbelo before migrations.
 *
 * Planes: auth | public | backoffice
 *
 * Usage (from apps/backend):
 *   pnpm db:create-schemas
 *   tsx scripts/db/create-schemas.ts
 */
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config as loadDotenv } from 'dotenv';
import { Pool } from 'pg';

const SCHEMAS = ['auth', 'backoffice', 'public'] as const;

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

async function main(): Promise<void> {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('❌ DATABASE_URL is not set');
        console.error('💡 Put DATABASE_URL in apps/backend/.env or the monorepo root .env');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString,
        ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        max: 1,
    });

    const client = await pool.connect();
    try {
        console.log('📦 Creating PostgreSQL schemas...\n');

        for (const schema of SCHEMAS) {
            await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
            console.log(`✅ Schema "${schema}" created (or already exists)`);
        }

        console.log('\n🔧 Installing required extensions...');
        try {
            await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
            console.log('✅ pgcrypto extension installed');
        } catch (error) {
            console.error('⚠️  Error installing pgcrypto:', error);
        }

        try {
            await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
            console.log('✅ uuid-ossp extension installed');
        } catch (error) {
            console.error('⚠️  Error installing uuid-ossp:', error);
        }

        console.log('\n✨ Schemas ready — run pnpm db:push next');
    } catch (error) {
        console.error('❌ Error creating schemas:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
