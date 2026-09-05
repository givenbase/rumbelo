#!/usr/bin/env node
/**
 * Public API smoke — catch production-only 5xx that /health alone can miss.
 *
 * Usage:
 *   pnpm api:smoke
 *   BACKEND_URL=https://api.example.com pnpm api:smoke
 *   pnpm api:smoke -- --strict-ready
 *
 * Pass = no HTTP 5xx. 4xx is allowed (auth / not found) unless expectOk is set.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const strictReady = process.argv.includes('--strict-ready');

function loadDotEnv(path) {
    try {
        const content = readFileSync(path, 'utf8');
        const vars = {};
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eq = trimmed.indexOf('=');
            if (eq <= 0) continue;
            const key = trimmed.slice(0, eq).trim();
            let value = trimmed.slice(eq + 1).trim();
            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1);
            }
            vars[key] = value;
        }
        return vars;
    } catch {
        return {};
    }
}

const env = {
    ...loadDotEnv(resolve(repoRoot, '.env')),
    ...loadDotEnv(resolve(repoRoot, 'apps/backend/.env')),
    ...process.env,
};

const backend = (
    env.BACKEND_URL ??
    env.DOMAIN_BACK ??
    env.NEXT_PUBLIC_DOMAIN_BACK ??
    'http://localhost:3002'
).replace(/\/$/, '');

/** @typedef {{ path: string, label: string, expectOk?: boolean, allowStatuses?: number[], healthStatus?: string[], readyStrict?: boolean }} SmokeEndpoint */

/** @type {SmokeEndpoint[]} */
const endpoints = [
    {
        path: '/health',
        label: 'health',
        expectOk: true,
        healthStatus: ['ok', 'degraded'],
    },
    {
        path: '/health/live',
        label: 'live',
        expectOk: true,
        healthStatus: ['alive'],
    },
    {
        path: '/health/ready',
        label: 'ready',
        readyStrict: true,
        healthStatus: ['ready'],
        allowStatuses: [200, 503],
    },
];

async function fetchJson(url) {
    const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        redirect: 'manual',
    });
    const text = await res.text();
    let body = null;
    try {
        body = text ? JSON.parse(text) : null;
    } catch {
        body = text;
    }
    return { status: res.status, body };
}

function fail(message) {
    console.error(`✗ ${message}`);
    process.exitCode = 1;
}

async function main() {
    console.log(`API smoke → ${backend}`);
    let failures = 0;

    for (const ep of endpoints) {
        const url = `${backend}${ep.path}`;
        try {
            const { status, body } = await fetchJson(url);
            const allowed = ep.allowStatuses ?? (ep.expectOk ? [200] : [200, 400, 401, 403, 404]);

            if (status >= 500) {
                fail(`${ep.label}: HTTP ${status} (5xx)`);
                failures++;
                continue;
            }

            if (!allowed.includes(status)) {
                fail(`${ep.label}: HTTP ${status} (expected ${allowed.join('|')})`);
                failures++;
                continue;
            }

            if (ep.healthStatus && body && typeof body === 'object' && 'status' in body) {
                const ok = ep.healthStatus.includes(body.status);
                if (!ok) {
                    if (ep.readyStrict && strictReady) {
                        fail(
                            `${ep.label}: status=${body.status} (want ${ep.healthStatus.join('|')})`
                        );
                        failures++;
                        continue;
                    }
                    if (ep.readyStrict && !strictReady && body.status !== 'ready') {
                        console.warn(`⚠ ${ep.label}: status=${body.status} (non-strict)`);
                        continue;
                    }
                    if (!ep.readyStrict) {
                        fail(`${ep.label}: status=${body.status}`);
                        failures++;
                        continue;
                    }
                }
            }

            console.log(`✓ ${ep.label} (${status})`);
        } catch (err) {
            fail(`${ep.label}: ${err instanceof Error ? err.message : String(err)}`);
            failures++;
        }
    }

    if (failures > 0) {
        console.error(`\n${failures} smoke check(s) failed`);
        process.exit(1);
    }
    console.log('\nAll smoke checks passed');
}

main();
