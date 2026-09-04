import { Module } from '@nestjs/common';

import { LeverModule } from './lever/lever.module';
import { MilestoneModule } from './milestone/milestone.module';

/**
 * Product: Groei. Everything about raising earning power rather than dividing
 * what already arrived. Mirrors the Groei portal in the application navigation.
 */
@Module({
    imports: [LeverModule, MilestoneModule],
    exports: [LeverModule, MilestoneModule],
})
export class GrowthModule {}
