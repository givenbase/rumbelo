import { populateContractRouterPaths } from '@orpc/contract';
import { contract as platform } from './platform/index';
import { contract as money } from './money/index';
import { contract as growth } from './growth/index';
import { contract as energy } from './energy/index';
import { contract as soul } from './soul/index';

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
