import { populateContractRouterPaths } from '@orpc/contract';
import { contract as platform } from '../public/platform/router';
import { contract as money } from '../public/product/money/router';
import { contract as growth } from '../public/product/growth/router';
import { contract as energy } from '../public/product/energy/router';
import { contract as soul } from '../public/product/soul/router';

/**
 * Contract-first oRPC, grouped by product (wire paths stay short for nav parity):
 * `contract.money.jars.list` → `/money/jars/list`.
 *
 * Folder ownership mirrors the backend plane tree
 * (`public/product/money`, …) — see README “Where does it belong?”.
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
