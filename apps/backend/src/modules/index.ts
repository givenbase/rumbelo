import { AuthModule } from './auth/auth.module';
import { BackofficeModule } from './backoffice/backoffice.module';
import { PlatformModule } from './platform/platform.module';
import { ProductModule } from './product/product.module';

/**
 * Registered by AppModule. Grouped by audience / who writes:
 *
 *   auth/        identity — better-auth + account prefs (user)
 *   platform/    household board + coach (household / user)
 *   product/     four portals (household / user)
 *   backoffice/  catalogs we publish (Rumbelo) — reference, plan, content
 */
export const FeatureModules = [AuthModule, PlatformModule, ProductModule, BackofficeModule];
