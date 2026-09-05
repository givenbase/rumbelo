import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config as loadDotenv } from 'dotenv';

/**
 * Load the first matching .env file into process.env.
 * Same pattern as galighticus-platform `shared/config/env/load-env.ts`:
 * dotenv does **not** override keys already set (Railway / CI win).
 *
 * Safe to call multiple times.
 */
export function loadEnvFiles(): string | undefined {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const envFiles = [`.env.${nodeEnv}.local`, `.env.${nodeEnv}`, '.env.local', '.env'];

    const cwd = process.cwd();
    const backendDir = join(cwd, 'apps', 'backend');
    const thisDir = dirname(fileURLToPath(import.meta.url));
    // src/common/config → apps/backend
    const backendPkgRoot = resolve(thisDir, '..', '..', '..');
    const monorepoRoot = resolve(backendPkgRoot, '..', '..');

    const basePaths = [cwd, backendDir, backendPkgRoot, monorepoRoot].filter(
        (path, index, all) => all.indexOf(path) === index
    );

    for (const file of envFiles) {
        for (const base of basePaths) {
            const envPath = join(base, file);
            try {
                if (existsSync(envPath)) {
                    loadDotenv({ path: envPath });
                    return envPath;
                }
            } catch {
                // ignore unreadable paths
            }
        }
    }

    return undefined;
}
