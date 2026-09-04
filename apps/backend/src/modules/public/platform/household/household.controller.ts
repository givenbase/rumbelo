import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../common/decorators/controller-swagger.decorators';
import { HouseholdService } from './household.service';

/** Transport only. Handler order is always CRUD. */
@ControllerSwagger('household', 'public')
export class HouseholdController {
    constructor(@Inject(HouseholdService) private readonly households: HouseholdService) {}

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    /** Provision a new household and seed jars + settings. */
    @Implement(contract.household.onboard)
    onboard() {
        return implement(contract.household.onboard).handler(({ input }) =>
            this.households.onboard(input)
        );
    }

    /** Send a membership invitation to an e-mail address. */
    @Implement(contract.household.invite)
    invite() {
        return implement(contract.household.invite).handler(({ input }) =>
            this.households.invite(input.householdId, input.email, input.role)
        );
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** List all households the current user belongs to. */
    @Implement(contract.household.list)
    list() {
        return implement(contract.household.list).handler(() => this.households.listHouseholds());
    }

    /** List members of a household. */
    @Implement(contract.household.members)
    members() {
        return implement(contract.household.members).handler(({ input }) =>
            this.households.members(input.householdId)
        );
    }

    /** Read household settings (lazy-created on first access). */
    @Implement(contract.household.settings)
    settings() {
        return implement(contract.household.settings).handler(({ input }) =>
            this.households.settings(input.householdId)
        );
    }

    /** Return the active household summary. */
    @Implement(contract.household.current)
    current() {
        return implement(contract.household.current).handler(({ input }) =>
            this.households.current(input.householdId)
        );
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    /** Patch household settings (currency, period, rituals, …). */
    @Implement(contract.household.updateSettings)
    updateSettings() {
        return implement(contract.household.updateSettings).handler(({ input }) => {
            const { householdId, ...patch } = input;
            return this.households.updateSettings(householdId, patch as never);
        });
    }
}
