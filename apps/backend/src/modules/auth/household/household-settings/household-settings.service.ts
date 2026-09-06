import {
    type HouseholdKind,
    type HouseholdSettings as HouseholdSettingsDto,
    type HouseholdSettingsPatch,
    type PlanKey,
    canUseHouseholdKind,
    capabilitiesFor,
    householdFitsPlan,
} from '@rumbelo/contracts';

import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { AuthMember } from '../managed/member/auth-member.entity';
import {
    DEFAULT_FEATURE_SETTINGS,
    DEFAULT_MONEY_SETTINGS,
    DEFAULT_RITUAL_SETTINGS,
    HouseholdSettings,
} from './household-settings.entity';

/** Fields onboarding fixes at creation; everything else takes entity defaults. */
export interface CreateHouseholdSettingsInput {
    householdId: string;
    kind: HouseholdKind;
    planKey: PlanKey;
    currency: HouseholdSettingsDto['currency'];
    why: string | null;
    money: Partial<HouseholdSettingsDto['money']>;
}

/**
 * Household money-board preferences (`household_settings`).
 *
 * One row per Better Auth household; created by onboarding or lazily on first
 * read. Plan / kind rules (Basic is solo-only, seat limits) are enforced here.
 */
@Injectable()
export class HouseholdSettingsService {
    constructor(@Inject(EntityManager) private readonly em: EntityManager) {}

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    /** Seed the settings row during onboarding. Caller flushes. */
    create(input: CreateHouseholdSettingsInput): HouseholdSettings {
        return this.em.create(HouseholdSettings, {
            householdId: input.householdId,
            kind: input.kind,
            planKey: input.planKey,
            currency: input.currency,
            why: input.why,
            moneySettings: { ...DEFAULT_MONEY_SETTINGS, ...input.money },
            ritualSettings: { ...DEFAULT_RITUAL_SETTINGS },
            featureSettings: { ...DEFAULT_FEATURE_SETTINGS },
            answers: {},
            onboardedAt: new Date(),
        } as never);
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    /** Settings row is created lazily so onboarding never has to pre-seed it. */
    async get(householdId: string): Promise<HouseholdSettingsDto> {
        let row = await this.em.findOne(HouseholdSettings, { householdId });
        if (!row) {
            row = this.em.create(HouseholdSettings, { householdId } as never);
            await this.em.persist(row).flush();
        }
        return toSettingsDto(row);
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    async update(
        householdId: string,
        patch: Omit<HouseholdSettingsPatch, 'householdId'>
    ): Promise<HouseholdSettingsDto> {
        let row = await this.em.findOne(HouseholdSettings, { householdId });
        if (!row) {
            row = this.em.create(HouseholdSettings, { householdId } as never);
            this.em.persist(row);
        }

        const nextPlan = patch.planKey ?? row.planKey;
        const nextKind = patch.kind ?? row.kind;

        if (patch.kind !== undefined && !canUseHouseholdKind(nextPlan, patch.kind)) {
            throw new BadRequestException(
                `${nextPlan} does not allow household kind ${patch.kind}`
            );
        }

        if (patch.planKey !== undefined) {
            const memberCount = await this.em.count(AuthMember, { household: householdId });
            if (!householdFitsPlan(patch.planKey, { memberCount, kind: nextKind })) {
                const caps = capabilitiesFor(patch.planKey);
                throw new BadRequestException(
                    caps.maxMembers !== null && memberCount > caps.maxMembers
                        ? `Cannot switch to ${patch.planKey}: household has ${memberCount} members (max ${caps.maxMembers})`
                        : `Cannot switch to ${patch.planKey}: household kind ${nextKind} is not allowed`
                );
            }
        }

        if (patch.why !== undefined) row.why = patch.why;
        if (patch.kind !== undefined) row.kind = patch.kind;
        if (patch.currency !== undefined) row.currency = patch.currency;
        if (patch.planKey !== undefined) row.planKey = patch.planKey;
        if (patch.money) {
            row.moneySettings = { ...row.moneySettings, ...patch.money };
        }
        if (patch.ritual) {
            row.ritualSettings = { ...row.ritualSettings, ...patch.ritual };
        }
        if (patch.features) {
            row.featureSettings = { ...row.featureSettings, ...patch.features };
        }
        if (patch.answers) {
            row.answers = { ...row.answers, ...patch.answers };
        }

        await this.em.flush();
        return toSettingsDto(row);
    }
}

function toSettingsDto(row: HouseholdSettings): HouseholdSettingsDto {
    return {
        householdId: row.householdId,
        why: row.why,
        kind: row.kind,
        currency: row.currency,
        planKey: row.planKey,
        money: {
            ...DEFAULT_MONEY_SETTINGS,
            ...row.moneySettings,
        },
        ritual: {
            ...DEFAULT_RITUAL_SETTINGS,
            ...row.ritualSettings,
        },
        features: {
            ...DEFAULT_FEATURE_SETTINGS,
            ...row.featureSettings,
        },
        answers: row.answers ?? {},
        onboardedAt: row.onboardedAt ? row.onboardedAt.toISOString() : null,
    };
}
