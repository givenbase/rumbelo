import { config as loadDotenv } from 'dotenv';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getMigrations } from 'better-auth/db/migration';
import { createAuth } from './auth.config.js';
import { loadEnv } from '../common/config/env.config.js';

function findRootEnv(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 6; i++) {
    const candidate = resolve(dir, '.env');
    if (existsSync(candidate)) return candidate;
    dir = resolve(dir, '..');
  }
  return resolve(dirname(fileURLToPath(import.meta.url)), '../../../../.env');
}

loadDotenv({ path: findRootEnv() });

const auth = createAuth(loadEnv());
const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options);

if (toBeCreated.length === 0 && toBeAdded.length === 0) {
  console.log('No better-auth migrations needed.');
  process.exit(0);
}

console.log(
  'Running better-auth migrations:',
  'create',
  toBeCreated.map((t) => t.table),
  'alter',
  toBeAdded.map((t) => t.table),
);

await runMigrations();
console.log('better-auth migrations completed.');
