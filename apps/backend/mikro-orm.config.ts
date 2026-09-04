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
    /**
     * Convention-based discovery (Galighticus pattern): every `*.entity.ts` file
     * next to its aggregate's service is an entity — no registry file to keep in
     * sync when a product is added.
     */
    entities: ['./dist/**/*.entity.js'],
    entitiesTs: ['./src/**/*.entity.ts'],
    clientUrl: process.env.DATABASE_URL,
    driverOptions:
        process.env.DATABASE_SSL === 'true'
            ? { connection: { ssl: { rejectUnauthorized: false } } }
            : {},
    /**
     * Tables are namespaced by domain — auth, platform, money, growth, energy,
     * soul — so the database mirrors the module tree. `public` holds only
     * MikroORM's own migrations table.
     *
     * The schema generator emits `create schema if not exists` for every schema an
     * entity declares, so the first migration provisions them all.
     */
    schema: 'public',
    /**
     * TsMorph reads property types from source (Galighticus pattern). Required
     * when running under `tsx`, which does not emit Reflect decorator metadata
     * the way `tsc`/`nest build` does — ReflectMetadataProvider then fails on
     * unions like `string | null`.
     */
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
