import { Module } from '@nestjs/common';
import { MilestoneController } from './milestone.controller.js';
import { MilestoneService } from './milestone.service.js';

@Module({ controllers: [MilestoneController], providers: [MilestoneService], exports: [MilestoneService] })
export class MilestoneModule {}
