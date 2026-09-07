import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import {
    hasCapability,
    withinLimit,
    type CapabilityKey,
    type PlanKey,
    type PlanLimitKey,
} from '@rumbelo/contracts';

import { HouseholdSettingsService } from '../../modules/auth/household/household-settings/household-settings.service';
import { currentHouseholdId } from '../household/household.context';

/** Shared plan access checks for services (limits + capability). */
@Injectable()
export class PlanAccessService {
    constructor(
        @Inject(HouseholdSettingsService) private readonly settings: HouseholdSettingsService
    ) {}

    async planKeyForCurrentHousehold(): Promise<PlanKey> {
        const settings = await this.settings.get(currentHouseholdId());
        return settings.planKey as PlanKey;
    }

    async assertCapability(capabilityKey: CapabilityKey): Promise<void> {
        const planKey = await this.planKeyForCurrentHousehold();
        if (!hasCapability(capabilityKey, planKey)) {
            throw new ForbiddenException(`Plan does not include ${capabilityKey}`);
        }
    }

    async assertWithinLimit(limitKey: PlanLimitKey, occupied: number): Promise<void> {
        const planKey = await this.planKeyForCurrentHousehold();
        if (!withinLimit(planKey, limitKey, occupied)) {
            throw new ForbiddenException(`Plan limit reached for ${limitKey}`);
        }
    }
}
