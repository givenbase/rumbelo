import { Module } from '@nestjs/common';

import { ReferenceModule } from '../../../../../backoffice/reference';

import { CatalogController } from './catalog.controller';

@Module({
    imports: [ReferenceModule],
    controllers: [CatalogController],
})
export class CatalogModule {}
