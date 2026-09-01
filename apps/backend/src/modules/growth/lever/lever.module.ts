import { Module } from '@nestjs/common';

import { LeverController } from './lever.controller.js';
import { LeverService } from './lever.service.js';

@Module({ controllers: [LeverController], providers: [LeverService], exports: [LeverService] })
export class LeverModule {}
