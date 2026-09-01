import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { contract } from '@rumbelo/contracts';
import { HouseholdService } from './household.service.js';

@Controller()
export class HouseholdController {
  constructor(private readonly households: HouseholdService) {}

  @Implement(contract.household.list)
  list() {
    return implement(contract.household.list).handler(() => this.households.listHouseholds());
  }

  @Implement(contract.household.members)
  members() {
    return implement(contract.household.members).handler(({ input }) =>
      this.households.members(input.householdId),
    );
  }

  @Implement(contract.household.settings)
  settings() {
    return implement(contract.household.settings).handler(({ input }) =>
      this.households.settings(input.householdId),
    );
  }

  @Implement(contract.household.updateSettings)
  updateSettings() {
    return implement(contract.household.updateSettings).handler(({ input }) => {
      const { householdId, ...patch } = input;
      return this.households.updateSettings(householdId, patch as never);
    });
  }

  @Implement(contract.household.current)
  current() {
    return implement(contract.household.current).handler(({ input }) =>
      this.households.current(input.householdId),
    );
  }

  @Implement(contract.household.onboard)
  onboard() {
    return implement(contract.household.onboard).handler(({ input }) =>
      this.households.onboard(input),
    );
  }

  @Implement(contract.household.invite)
  invite() {
    return implement(contract.household.invite).handler(({ input }) =>
      this.households.invite(input.householdId, input.email, input.role),
    );
  }
}
