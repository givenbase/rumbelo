import { Module } from '@nestjs/common';

import { MoneyPresetModule } from './preset';
import { MoneyTemplateModule } from './template';

/** Backoffice money catalogs — templates + presets for Geld. */
@Module({
    imports: [MoneyTemplateModule, MoneyPresetModule],
    exports: [MoneyTemplateModule, MoneyPresetModule],
})
export class MoneyProductModule {}
