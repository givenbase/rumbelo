import { config as loadDotenv } from 'dotenv';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

for (const file of ['.env', '.env.local']) {
    const path = resolve(packageRoot, file);
    if (existsSync(path)) loadDotenv({ path });
}

function readUrl(name: string, fallback: string): string {
    return (process.env[name] ?? fallback).replace(/\/$/, '');
}

export const DEMO_PASSWORD = process.env.E2E_DEMO_PASSWORD ?? 'RumbeloDemo1!';

export type DemoPersona = 'basic' | 'plus' | 'max';

export const e2eEnv = {
    appUrl: readUrl('APP_URL', 'http://localhost:3000'),
    backendUrl: readUrl('BACKEND_URL', 'http://localhost:3002'),
    accounts: {
        basic: {
            email: process.env.E2E_BASIC_EMAIL ?? 'basic@rumbelo.com',
            password: process.env.E2E_BASIC_PASSWORD ?? DEMO_PASSWORD,
        },
        plus: {
            email: process.env.E2E_PLUS_EMAIL ?? 'plus@rumbelo.com',
            password: process.env.E2E_PLUS_PASSWORD ?? DEMO_PASSWORD,
        },
        max: {
            email: process.env.E2E_MAX_EMAIL ?? 'max@rumbelo.com',
            password: process.env.E2E_MAX_PASSWORD ?? DEMO_PASSWORD,
        },
    },
} as const;

export function credentialsFor(persona: DemoPersona) {
    return e2eEnv.accounts[persona];
}
