import { Module } from '@nestjs/common';

import { JarModule } from '../../plan/jar/jar.module';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';

@Module({
    imports: [JarModule],
    controllers: [GoalController],
    providers: [GoalService],
    exports: [GoalService],
})
export class GoalModule {}
