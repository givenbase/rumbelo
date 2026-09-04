import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';
import { config as loadEnv } from 'dotenv';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** MikroORM CLI runs outside Nest — walk up to monorepo root `.env`. */
function findRootEnv(): string {
    let dir = dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 6; i++) {
        const candidate = resolve(dir, '.env');
        if (existsSync(candidate)) return candidate;
        dir = resolve(dir, '..');
    }
    return resolve(dirname(fileURLToPath(import.meta.url)), '../../.env');
}
loadEnv({ path: findRootEnv() });

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
    // Source entities only — we run under tsx (Galighticus). TsMorph must read
    // .ts files; a dist/**/*.js glob makes it look for sibling .ts under dist.
    entities: ['./src/**/*.entity.ts'],
    entitiesTs: ['./src/**/*.entity.ts'],
    clientUrl: process.env.DATABASE_URL,
    driverOptions:
        process.env.DATABASE_SSL === 'true'
            ? { connection: { ssl: { rejectUnauthorized: false } } }
            : {},
    // Domain schemas: auth, platform, money, growth, energy, soul.
    // public holds only MikroORM's migrations table.
    schema: 'public',
    // TsMorph (Galighticus): tsx does not emit Reflect decorator metadata.
    metadataProvider: TsMorphMetadataProvider,
    extensions: [Migrator, SeedManager],
    // Never auto-sync a schema that holds money. Migrations only.
    migrations: {
        path: './src/database/migrations',
        pathTs: './src/database/migrations',
        snapshot: true,
    },
    seeder: {
        path: './src/database/seeders',
        pathTs: './src/database/seeders',
        defaultSeeder: 'DatabaseSeeder',
    },
    debug: !isProd,
    forceUtcTimezone: true,
});
