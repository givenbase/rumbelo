/**
 * Soul Router
 * Composes leaf contracts into the soul product contract tree.
 * Wire paths: `contract.soul.gratitude.list`, `contract.soul.weekCheck.current`, etc.
 *
 * Mirror: apps/backend/src/modules/public/product/soul/
 */

import { soulDashboardContract } from './dashboard/dashboard.contract';
import { gratitudeContract } from './gratitude/gratitude.contract';
import { soulWeekCheckContract } from './week-check/week-check.contract';

export const contract = {
    gratitude: gratitudeContract,
    dashboard: soulDashboardContract,
    weekCheck: soulWeekCheckContract,
};
