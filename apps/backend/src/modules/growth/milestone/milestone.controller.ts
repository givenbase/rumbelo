import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { contract } from '@rumbelo/contracts';
import { MilestoneService } from './milestone.service.js';

@Controller()
export class MilestoneController {
  constructor(private readonly milestones: MilestoneService) {}

  @Implement(contract.growth.milestones.list)
  list() { return implement(contract.growth.milestones.list).handler(() => this.milestones.list()); }
}
