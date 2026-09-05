import { Module } from '@nestjs/common';

import { CategoryTemplateModule } from './category';
import { JarTemplateModule } from './jar';

/** Money templates — jar + category spines households copy from. */
@Module({
    imports: [JarTemplateModule, CategoryTemplateModule],
    exports: [JarTemplateModule, CategoryTemplateModule],
})
export class MoneyTemplateModule {}
