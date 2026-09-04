import { Module } from '@nestjs/common';

import { PlatformModule } from './platform/platform.module';
import { ProductModule } from './product/product.module';

/**
 * Public plane — household/app data (Postgres `public` schema).
 *
 *   platform/  household board + coach
 *   product/   money, growth, energy, soul
 *
 * Distinct from `auth` (identity) and `backoffice` (catalogs we publish).
 */
@Module({
    imports: [PlatformModule, ProductModule],
    exports: [PlatformModule, ProductModule],
})
export class PublicModule {}
