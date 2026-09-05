import { Module } from '@nestjs/common';

import { PresetModule } from './preset';
import { TemplateModule } from './template';

/**
 * Backoffice reference catalogs — templates (jar, category) and presets
 * (fixed-cost, debt, income, goal, merchant). We write; households only read/copy.
 */
@Module({
    imports: [TemplateModule, PresetModule],
    exports: [TemplateModule, PresetModule],
})
export class ReferenceModule {}
