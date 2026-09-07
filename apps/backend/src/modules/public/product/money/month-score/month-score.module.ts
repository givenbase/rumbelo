import { Module } from '@nestjs/common';

import { JarModule } from '../plan/jar/jar.module';
import { MonthScoreController } from './month-score.controller';
import { MonthScoreService } from './month-score.service';

@Module({
    imports: [JarModule],
    controllers: [MonthScoreController],
    providers: [MonthScoreService],
    exports: [MonthScoreService],
})
export class MonthScoreModule {}
