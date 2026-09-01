import { config as loadEnv } from 'dotenv';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ReflectMetadataProvider } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import * as entities from './src/entities.registry.js';

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
  // Enums and constant maps are plain objects; only entity classes are functions.
  entities: Object.values(entities).filter((value) => typeof value === 'function') as never,
  entitiesTs: ['src/**/*.entity.ts'],
  clientUrl: process.env.DATABASE_URL,
  driverOptions:
    process.env.DATABASE_SSL === 'true'
      ? { connection: { ssl: { rejectUnauthorized: false } } }
      : {},
  /**
   * Tables are namespaced by product — platform, money, growth, energy, soul —
   * so the database mirrors the module tree. `public` stays the default because
   * better-auth owns and migrates its own tables there.
   *
   * The schema generator emits `create schema if not exists` for every schema an
   * entity declares, so the first migration provisions all five.
   */
  schema: 'public',
  metadataProvider: ReflectMetadataProvider,
  extensions: [Migrator, SeedManager],
  // Never auto-sync a schema that holds money. Migrations only.
  migrations: { path: './src/database/migrations', pathTs: './src/database/migrations', snapshot: true },
  seeder: {
    path: './src/database/seeders',
    pathTs: './src/database/seeders',
    defaultSeeder: 'DatabaseSeeder',
  },
  debug: !isProd,
  forceUtcTimezone: true,
});
