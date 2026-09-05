/**
 * Schemas barrel — re-exports every domain for routers that import `* as S`.
 * Source of truth lives under the plane/product tree; prefer public imports via
 * `@rumbelo/contracts/{domain}`.
 */
export * from '../common/schemas';
export * from '../backoffice/plan/schemas';
export * from '../public/platform/schemas';
export * from '../public/product/money/schemas';
export * from '../public/product/growth/schemas';
export * from '../public/product/energy/schemas';
export * from '../public/product/soul/schemas';
