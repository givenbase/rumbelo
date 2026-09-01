import { Module } from '@nestjs/common';
import { JarController } from './jar.controller.js';
import { JarService } from './jar.service.js';

@Module({
  controllers: [JarController],
  providers: [JarService],
  exports: [JarService],
})
export class JarModule {}
