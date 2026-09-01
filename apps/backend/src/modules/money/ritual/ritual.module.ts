import { Module } from '@nestjs/common';
import { RitualController } from './ritual.controller.js';
import { RitualService } from './ritual.service.js';

@Module({
  controllers: [RitualController],
  providers: [RitualService],
  exports: [RitualService],
})
export class RitualModule {}
