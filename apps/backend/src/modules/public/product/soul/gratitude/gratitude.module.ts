import { Module } from '@nestjs/common';

import { AccountModule } from '../../../../auth/user/account/account.module';
import { GratitudeController } from './gratitude.controller';
import { GratitudeService } from './gratitude.service';

@Module({
    imports: [AccountModule],
    controllers: [GratitudeController],
    providers: [GratitudeService],
    exports: [GratitudeService],
})
export class GratitudeModule {}
