/**
 * Money product contracts — enums + schemas.
 * Prefer: `import { JarKey, DebtKind } from '@rumbelo/contracts/money'`
 *
 * Cadence / FlowDirection live in common but PG types are money_* —
 * re-exported here so money call sites stay on one subpath.
 *
 * Mirror: apps/backend/src/modules/public/product/money/
 */
export * from './enums';
export { Cadence, FlowDirection, CADENCE_TO_MONTHLY } from '../../../common/enums';
export * from './schemas';
