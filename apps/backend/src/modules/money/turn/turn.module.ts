import { Module } from '@nestjs/common';

import { JarModule } from '../jar/jar.module.js';
import { TurnController } from './turn.controller.js';
import { TurnService } from './turn.service.js';

@Module({
    imports: [JarModule],
    controllers: [TurnController],
    providers: [TurnService],
    exports: [TurnService],
})
export class TurnModule {}
