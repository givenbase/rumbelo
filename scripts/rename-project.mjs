#!/usr/bin/env node
/**
 * Rename the project across the monorepo.
 *
 * The product name was the single hardest thing to settle, so it is deliberately
 * cheap to change: one command rewrites the npm scope, package names and copy.
 * It does NOT rename the git remote, the repo folder, or deployed resources.
 *
 *   node scripts/rename-project.mjs <new-name>
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CURRENT = 'rumbelo';
const next = process.argv[2]?.trim().toLowerCase();

if (!next || !/^[a-z][a-z0-9-]{1,38}$/.test(next)) {
  console.error('Usage: node scripts/rename-project.mjs <new-name>');
  console.error('Name must be lowercase, start with a letter, and use only a-z 0-9 -');
  process.exit(1);
}
if (next === CURRENT) {
  console.error(`Already named "${CURRENT}".`);
  process.exit(1);
}

const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'dist', '.turbo', '.pnpm-store']);
const EXTENSIONS = /\.(ts|tsx|js|jsx|mjs|cjs|json|md|yaml|yml|css)$/;
const capitalise = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (SKIP_DIRS.has(entry.name)) return [];
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : EXTENSIONS.test(entry.name) ? [path] : [];
  });
}

let changed = 0;
for (const file of walk(process.cwd())) {
  const before = readFileSync(file, 'utf8');
  // Capitalised form first: replacing the lowercase form first would leave
  // "Rumbelo" unmatched once its tail had already been rewritten.
  const after = before
    .replaceAll(capitalise(CURRENT), capitalise(next))
    .replaceAll(CURRENT, next);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}

console.log(`Renamed ${CURRENT} -> ${next} across ${changed} files.`);
console.log('Next: rm -rf node_modules && pnpm install, then rename the folder and git remote.');
