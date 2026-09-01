/**
 * Single import surface for MikroORM. Entities live with their aggregate, but the
 * ORM needs one flat list — collecting it here keeps mikro-orm.config.ts from
 * reaching into every product folder. Grouped by product to mirror modules/.
 */

// Platform
export * from './modules/household/entities/index.js';
export * from './modules/coach/entities/index.js';

// Product: Geld
export * from './modules/money/jar/entities/index.js';
export * from './modules/money/income/entities/index.js';
export * from './modules/money/fixed-cost/entities/index.js';
export * from './modules/money/account/entities/index.js';
export * from './modules/money/transaction/entities/index.js';
export * from './modules/money/rule/entities/index.js';
export * from './modules/money/goal/entities/index.js';
export * from './modules/money/debt/entities/index.js';
export * from './modules/money/turn/entities/index.js';
export * from './modules/money/ritual/entities/index.js';

// Product: Groei
export * from './modules/growth/lever/entities/index.js';
export * from './modules/growth/milestone/entities/index.js';

// Product: Energie
export * from './modules/energy/log/entities/index.js';

// Product: Ziel
export * from './modules/soul/gratitude/entities/index.js';
