import { Module } from '@nestjs/common';

import { GrowthCatalogModule } from './catalog';
import { GrowthPresetModule } from './preset';

/** Backoffice growth catalogs — presets + taxonomies for Groei. */
@Module({
    imports: [GrowthCatalogModule, GrowthPresetModule],
    exports: [GrowthCatalogModule, GrowthPresetModule],
})
export class GrowthProductModule {}
