import { AuthModule } from './auth/auth.module';
import { BackofficeModule } from './backoffice/backoffice.module';
import { PublicModule } from './public/public.module';

/**
 * Registered by AppModule. Grouped by Postgres plane / who writes:
 *
 *   auth/        identity — better-auth + account prefs
 *   public/      platform + product (household / user) — schema `public`
 *   backoffice/  catalogs we publish (Rumbelo)
 */
export const FeatureModules = [AuthModule, PublicModule, BackofficeModule];
