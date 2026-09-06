import { contract } from '@rumbelo/contracts';

import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';

import { ControllerSwagger } from '../../../../common/decorators/controller-swagger.decorators';
import { HouseholdSettingsService } from './household-settings.service';

/** Implements `contract.household.settings` / `updateSettings`. Transport only. */
@ControllerSwagger('household', 'public')
export class HouseholdSettingsController {
    constructor(
        @Inject(HouseholdSettingsService) private readonly settings: HouseholdSettingsService
    ) {}

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Read household settings (lazy-created on first access). */
    @Implement(contract.household.settings)
    get() {
        return implement(contract.household.settings).handler(({ input }) =>
            this.settings.get(input.householdId)
        );
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    /** Patch household settings (currency, period, rituals, …). */
    @Implement(contract.household.updateSettings)
    update() {
        return implement(contract.household.updateSettings).handler(({ input }) => {
            const { householdId, ...patch } = input;
            return this.settings.update(householdId, patch as never);
        });
    }
}
