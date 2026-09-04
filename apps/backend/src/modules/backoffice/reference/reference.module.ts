import { Module } from '@nestjs/common';

import { JarTemplateModule } from './jar-template';

/**
 * Backoffice reference catalogs — countries, jar templates, question banks, …
 * We write; the app and households only read (or copy on onboard).
 */
@Module({
    imports: [JarTemplateModule],
    exports: [JarTemplateModule],
})
export class ReferenceModule {}
