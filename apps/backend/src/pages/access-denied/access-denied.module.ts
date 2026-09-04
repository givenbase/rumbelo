import { Module } from '@nestjs/common';

import { AccessDeniedController } from './access-denied.controller';

@Module({
    controllers: [AccessDeniedController],
})
export class AccessDeniedModule {}
