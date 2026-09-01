import { defineConfig } from 'tsup';

/**
 * Dual-format build. The Nest backend is CommonJS (MikroORM entity decorators and
 * circular relations misbehave under ESM), while both Next apps are ESM. Shipping
 * both from one source keeps a single contract definition without the internal
 * HTTP hop the earlier migration plan proposed.
 *
 * Two configs, not one: bundlers strip module-level directives, so the React entry
 * needs "use client" re-attached as a banner or Next will treat it as a server module.
 */
const shared = {
  format: ['esm', 'cjs'] as const,
  dts: true,
  sourcemap: true,
  treeshake: true,
  external: ['react', '@tanstack/react-query'],
};

export default defineConfig([
  { ...shared, entry: { index: 'src/index.ts' }, clean: true },
  {
    ...shared,
    entry: { react: 'src/client/react.tsx' },
    clean: false,
  },
]);
