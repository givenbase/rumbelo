import { Module } from '@nestjs/common';

import { AccountModule } from '../../../../auth/user/account/account.module';
import { LogController } from './log.controller';
import { LogService } from './log.service';

@Module({
    imports: [AccountModule],
    controllers: [LogController],
    providers: [LogService],
    exports: [LogService],
})
export class LogModule {}
