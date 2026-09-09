/**
 * Platform contracts — household / coach / person-board enums + schemas.
 * Prefer: `import { HouseholdKind, Currency } from '@rumtelo/contracts/platform'`
 *
 * Currency is stored as platform_currency — re-exported from common.
 *
 * Mirror: apps/backend/src/modules/public/platform/
 */
export * from './enums';
export { Currency } from '../../common/enums';
export * from './schemas';
