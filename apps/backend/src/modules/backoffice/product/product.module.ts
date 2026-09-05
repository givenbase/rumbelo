import { Module } from '@nestjs/common';

import { GrowthProductModule } from './growth';
import { MoneyProductModule } from './money';

/**
 * Backoffice product catalogs — company-authored rows tied to a product line.
 * Kind folders under each product: template | preset | catalog (create only when used).
 */
@Module({
    imports: [MoneyProductModule, GrowthProductModule],
    exports: [MoneyProductModule, GrowthProductModule],
})
export class ProductModule {}
