import { Module } from '@nestjs/common';

import { ProductModule } from '../../../../../backoffice/product';

import { MoneyCatalogsController } from './catalogs.controller';

/** Public API surface for money company catalogs (templates + presets). */
@Module({
    imports: [ProductModule],
    controllers: [MoneyCatalogsController],
})
export class MoneyCatalogsModule {}
