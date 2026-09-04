import { Module } from '@nestjs/common';

import { JarModule } from '../../plan/jar/jar.module';
import { TurnController } from './turn.controller';
import { TurnService } from './turn.service';

@Module({
    imports: [JarModule],
    controllers: [TurnController],
    providers: [TurnService],
    exports: [TurnService],
})
export class TurnModule {}
