import { Module } from '@nestjs/common';

import { GratitudeController } from './gratitude.controller.js';
import { GratitudeService } from './gratitude.service.js';

@Module({ controllers: [GratitudeController], providers: [GratitudeService], exports: [GratitudeService] })
export class GratitudeModule {}
