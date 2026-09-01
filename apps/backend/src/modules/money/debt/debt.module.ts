import { Module } from '@nestjs/common';

import { DebtController } from './debt.controller.js';
import { DebtService } from './debt.service.js';

@Module({
  controllers: [DebtController],
  providers: [DebtService],
  exports: [DebtService],
})
export class DebtModule {}
