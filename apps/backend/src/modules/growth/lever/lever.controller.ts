import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { contract } from '@rumbelo/contracts';
import { LeverService } from './lever.service.js';

@Controller()
export class LeverController {
  constructor(private readonly levers: LeverService) {}

  @Implement(contract.growth.levers.list)
  list() { return implement(contract.growth.levers.list).handler(() => this.levers.list()); }
}
