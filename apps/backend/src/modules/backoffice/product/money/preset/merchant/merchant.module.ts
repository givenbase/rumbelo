import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { MerchantPreset } from './merchant.entity';
import { MerchantPresetService } from './merchant.service';

@Module({
    imports: [MikroOrmModule.forFeature([MerchantPreset])],
    providers: [MerchantPresetService],
    exports: [MerchantPresetService],
})
export class MerchantPresetModule {}
