import { Module } from '@nestjs/common';
import { JarModule } from '../jar/jar.module.js';
import { IncomeController } from './income.controller.js';
import { IncomeService } from './income.service.js';

@Module({
  imports: [JarModule],
  controllers: [IncomeController],
  providers: [IncomeService],
  exports: [IncomeService],
})
export class IncomeModule {}
