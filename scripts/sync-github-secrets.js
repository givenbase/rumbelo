#!/usr/bin/env node
/**
 * Push repo-root .env files to GitHub Environment secrets / variables.
 *
 * Templates mirror apps/backend/.env.example, root .env.example, and
 * .github/workflows/README.md. When adding env keys, update those first, then
 * .env.github.*.example, then workflow references if CI needs them.
 *
 * Prerequisites: gh auth login; GitHub Environments named staging + production.
 *
 * Files (gitignored, per environment):
 *   .env.github.secrets.{staging,production} → gh secret set --env <name> -f
 *   .env.github.vars.{staging,production}    → gh variable set --env <name> -f
 *
 * Empty KEY= lines are skipped: GitHub Environment variables/secrets API rejects
 * missing values (HTTP 422). Fill a value locally, or omit the key from GitHub UI.
 *
 * Usage:
 *   pnpm sync:github-secrets:init   # copy *.example → the four files (skip existing)
 *   pnpm sync:github-secrets        # sync both envs
 *   pnpm sync:github-secrets --staging | --production
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');

const EXAMPLE_SECRETS = path.join(ROOT, '.env.github.secrets.example');
const EXAMPLE_VARS = path.join(ROOT, '.env.github.vars.example');

function copyIfMissing(src, dest) {
    if (!fs.existsSync(src)) {
        console.error(`❌ Missing template: ${path.basename(src)}`);
        return false;
    }
    if (fs.existsSync(dest)) {
        console.log(`   (exists, skip) ${path.basename(dest)}`);
        return false;
    }
    fs.copyFileSync(src, dest);
    console.log(`   ✅ Created ${path.basename(dest)} — edit values, then run sync again`);
    return true;
}

function initFromExamples() {
    console.log('📋 Creating env files from templates (repo root)...\n');
    let created = 0;
    for (const env of ['staging', 'production']) {
        console.log(`Environment: ${env}`);
        if (copyIfMissing(EXAMPLE_SECRETS, path.join(ROOT, `.env.github.secrets.${env}`)))
            created++;
        if (copyIfMissing(EXAMPLE_VARS, path.join(ROOT, `.env.github.vars.${env}`))) created++;
        console.log('');
    }
    if (created === 0) {
        console.log(
            'No new files created (all four already exist). Edit them or delete to re-init.\n'
        );
    } else {
        console.log('Next: fill in real values, then: pnpm sync:github-secrets\n');
    }
}

function run(cmd, options = {}) {
    return execSync(cmd, {
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit',
        ...options,
    });
}

/**
 * Parse KEY=VALUE lines (.env-style). Ignores comments and blank lines.
 * Strips optional surrounding single/double quotes on values.
 */
function parseEnvLines(content) {
    const entries = [];
    for (const line of content.split(/\r?\n/)) {
        const t = line.trim();
        if (!t || t.startsWith('#')) continue;
        const eq = t.indexOf('=');
        if (eq <= 0) continue;
        const key = t.slice(0, eq).trim();
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
        let val = t.slice(eq + 1).trim();
        if (
            (val.startsWith('"') && val.endsWith('"') && val.length >= 2) ||
            (val.startsWith("'") && val.endsWith("'") && val.length >= 2)
        ) {
            val = val.slice(1, -1);
        }
        entries.push({ key, value: val });
    }
    return entries;
}

function isNonEmptyValue(value) {
    return value !== null && value !== undefined && String(value).trim().length > 0;
}

/** One dotenv line; quote value if needed for gh -f */
function encodeEnvLine(key, value) {
    const v = String(value);
    if (/[\r\n"#]/.test(v) || /\s/.test(v)) {
        const esc = v
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n');
        return `${key}="${esc}"`;
    }
    return `${key}=${v}`;
}

function writeFilteredEnvForGh(entries) {
    const lines = entries
        .filter(e => isNonEmptyValue(e.value))
        .map(e => encodeEnvLine(e.key, e.value.trim()));
    return lines.length ? `${lines.join('\n')}\n` : '';
}

function syncToGithub(envName, type, envFile) {
    if (!fs.existsSync(envFile)) {
        console.warn(`⚠️  Skipping ${envName} ${type}: ${path.basename(envFile)} not found`);
        return 0;
    }
    console.log(`   📄 ${type}: ${path.basename(envFile)}`);
    const raw = fs.readFileSync(envFile, 'utf8');
    const parsed = parseEnvLines(raw);
    const filled = parsed.filter(e => isNonEmptyValue(e.value));
    const skipped = parsed.length - filled.length;
    const label = type === 'secrets' ? 'secret' : 'variable';

    if (skipped > 0) {
        console.log(
            `   ⏭️  Skipped ${skipped} empty ${label} key(s) (GitHub requires a non-empty value per key)`
        );
    }

    const body = writeFilteredEnvForGh(parsed);
    if (!body) {
        console.warn(
            `⚠️  No non-empty ${type} in ${path.basename(envFile)} — nothing uploaded (fill values or remove unused keys)`
        );
        return 0;
    }

    const tmp = path.join(
        os.tmpdir(),
        `rumbelo-github-${type}-${envName}-${process.pid}-${Date.now()}.env`
    );
    fs.writeFileSync(tmp, body, 'utf8');
    const cmd =
        type === 'secrets'
            ? `gh secret set --env ${envName} -f "${tmp}"`
            : `gh variable set --env ${envName} -f "${tmp}"`;
    try {
        run(cmd, { cwd: ROOT });
        console.log(`✅ ${envName} ${type} updated (${filled.length} key(s))`);
        return 1;
    } catch (err) {
        console.error(`❌ Failed to sync ${envName} ${type}:`, err.message);
        return 0;
    } finally {
        try {
            fs.unlinkSync(tmp);
        } catch {
            /* ignore */
        }
    }
}

function syncEnv(envName) {
    const secretsFile = path.join(ROOT, `.env.github.secrets.${envName}`);
    const varsFile = path.join(ROOT, `.env.github.vars.${envName}`);
    console.log(`\n📤 Syncing environment: ${envName}...`);
    console.log(
        `   (reads ${path.basename(secretsFile)} + ${path.basename(varsFile)} — not *.example)`
    );
    let count = 0;
    count += syncToGithub(envName, 'secrets', secretsFile);
    count += syncToGithub(envName, 'variables', varsFile);
    return count;
}

function countExistingEnvFiles() {
    let n = 0;
    for (const env of ['staging', 'production']) {
        if (fs.existsSync(path.join(ROOT, `.env.github.secrets.${env}`))) n++;
        if (fs.existsSync(path.join(ROOT, `.env.github.vars.${env}`))) n++;
    }
    return n;
}

function printMissingFilesHelp() {
    const rootResolved = path.resolve(ROOT);
    const cwdResolved = path.resolve(process.cwd());
    const existing = countExistingEnvFiles();

    console.log(
        `\n── No GitHub env files were uploaded (${existing} / 4 files present at repo root) ──\n`
    );
    console.log('The sync script always looks here (monorepo root, same as CI checkout):');
    console.log(`  ${rootResolved}\n`);
    console.log('Expected filenames (gitignored — you create them locally):');
    console.log('  .env.github.secrets.staging      ← copy from .env.github.secrets.example');
    console.log('  .env.github.vars.staging         ← copy from .env.github.vars.example');
    console.log('  .env.github.secrets.production');
    console.log('  .env.github.vars.production\n');
    if (cwdResolved !== rootResolved) {
        console.log(`Your shell cwd is: ${cwdResolved}`);
        console.log('(That is OK — files still must live at repo root above.)\n');
    }
    if (existing > 0) {
        console.log(
            `Found ${existing} of 4 file(s) at repo root — fix missing ones or check gh errors above.\n`
        );
    } else {
        console.log('Quick start:');
        console.log(`  cd "${rootResolved}"`);
        console.log('  pnpm sync:github-secrets:init');
        console.log('  # edit the four .env.github.* files, then:');
        console.log('  pnpm sync:github-secrets\n');
    }
}

function main() {
    const args = new Set(process.argv.slice(2));
    if (args.has('--init') || args.has('-i')) {
        initFromExamples();
        return;
    }

    const stagingOnly = args.has('--staging') || args.has('-s');
    const productionOnly = args.has('--production') || args.has('-p');

    console.log('🔐 GitHub Secrets Sync\n');
    console.log('Checking gh auth...');
    try {
        run('gh auth status', { cwd: ROOT, silent: true });
    } catch {
        console.error('❌ GitHub CLI not authenticated. Run: gh auth login');
        process.exit(1);
    }

    const repo = execSync('gh repo view --json nameWithOwner -q .nameWithOwner', {
        encoding: 'utf8',
        cwd: ROOT,
    }).trim();
    console.log(`Repository: ${repo}\n`);

    let filesSynced = 0;
    if (!productionOnly) filesSynced += syncEnv('staging');
    if (!stagingOnly) filesSynced += syncEnv('production');

    console.log(`\n✨ Done. Synced ${filesSynced} file(s) to GitHub.`);
    if (filesSynced === 0) {
        printMissingFilesHelp();
    }
}

main();
