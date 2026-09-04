import { AuthModule } from './auth/auth.module';
import { EnergyModule } from './energy/energy.module';
import { GrowthModule } from './growth/growth.module';
import { MoneyModule } from './money/money.module';
import { PlatformModule } from './platform/platform.module';
import { SoulModule } from './soul/soul.module';

/**
 * Registered by AppModule. Grouped by audience:
 *
 *   auth/      identity plane — better-auth machinery plus Rumbelo account data
 *   platform/  shared plane — the household itself and cross-product advisory
 *   money/ growth/ energy/ soul/  household-facing products (the app's portals)
 *   backoffice/  employee-facing tools — reserved, created with its first feature
 */
export const FeatureModules = [
    AuthModule,
    PlatformModule,
    MoneyModule,
    GrowthModule,
    EnergyModule,
    SoulModule,
];
