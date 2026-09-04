import { Module } from '@nestjs/common';

import { JarModule } from '../jar/jar.module';
import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';

@Module({
    imports: [JarModule],
    controllers: [IncomeController],
    providers: [IncomeService],
    exports: [IncomeService],
})
export class IncomeModule {}
