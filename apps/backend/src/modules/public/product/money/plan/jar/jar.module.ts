import { Module } from '@nestjs/common';

import { JarController } from './jar.controller';
import { JarService } from './jar.service';

@Module({
    controllers: [JarController],
    providers: [JarService],
    exports: [JarService],
})
export class JarModule {}
