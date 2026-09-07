import { CAPABILITIES, contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { RequireCapability } from '../../../common/capability';
import { ControllerSwagger } from '../../../common/decorators/controller-swagger.decorators';
import { HouseholdService } from './household.service';

/**
 * Implements `contract.household.{onboard,invite,list,members,current}`.
 * Settings handlers live in `household-settings/`. Transport only.
 */
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
    @RequireCapability(CAPABILITIES.platformInvite)
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

    /** Return the active household summary. */
    @Implement(contract.household.current)
    current() {
        return implement(contract.household.current).handler(({ input }) =>
            this.households.current(input.householdId)
        );
    }
}
