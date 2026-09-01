import { populateContractRouterPaths } from '@orpc/contract';
import { contract as platform } from './platform/index.js';
import { contract as money } from './money/index.js';
import { contract as growth } from './growth/index.js';
import { contract as energy } from './energy/index.js';
import { contract as soul } from './soul/index.js';

/**
 * Contract-first oRPC, grouped by product.
 *
 * The nesting is the hierarchy: `contract.money.jars.list` becomes the route
 * `/rpc/money/jars/list`, so the API surface, the backend module tree and the
 * application navigation all read the same way.
 *
 * Paths are auto-filled for Nest `@Implement` (requires explicit route paths).
 */
const rawContract = {
    ...platform,
    money,
    growth,
    energy,
    soul,
};

export const contract = populateContractRouterPaths(rawContract);

export type AppContract = typeof contract;
