import { EnergyModule } from './energy/energy.module.js';
import { GrowthModule } from './growth/growth.module.js';
import { MoneyModule } from './money/money.module.js';
import { PlatformModule } from './platform/platform.module.js';
import { SoulModule } from './soul/soul.module.js';

/**
 * Registered by AppModule. Grouped by audience:
 *
 *   platform/  shared plane — the household itself and cross-product advisory
 *   money/ growth/ energy/ soul/  household-facing products (the app's portals)
 *   backoffice/  employee-facing tools — reserved, created with its first feature
 */
export const FeatureModules = [
    PlatformModule,
    MoneyModule,
    GrowthModule,
    EnergyModule,
    SoulModule,
];
