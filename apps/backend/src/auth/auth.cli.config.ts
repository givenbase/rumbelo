import { config as loadDotenv } from 'dotenv';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
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

/** Used by `@better-auth/cli migrate` only — not imported by Nest bootstrap. */
export default createAuth(loadEnv());
