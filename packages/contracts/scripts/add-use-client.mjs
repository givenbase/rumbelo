import { readFileSync, writeFileSync } from 'node:fs';

/**
 * Bundlers strip module-level directives. Next.js needs "use client" on the React
 * entry or it treats these hooks as server code and fails the build, so we
 * re-attach the directive after bundling.
 */
for (const file of ['dist/react.js', 'dist/react.cjs']) {
  const src = readFileSync(file, 'utf8');
  if (/^['"]use client['"]/.test(src)) continue;
  writeFileSync(file, `'use client';\n${src}`);
  console.log(`add-use-client: patched ${file}`);
}
