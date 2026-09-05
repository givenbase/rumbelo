import type { z } from 'zod';

import {
    Currency,
    HouseholdKind,
    HouseholdRole,
    IncomeKind,
    IncomeRhythm,
    PlanKey,
    type HouseholdSettings as HouseholdSettingsDto,
    type HouseholdSettingsPatch,
    type OnboardingInput,
    PayoffStrategy,
    canAddHouseholdMember,
    canInviteOnPlan,
    canUseHouseholdKind,
    capabilitiesFor,
    householdFitsPlan,
} from '@rumbelo/contracts';

import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';

import type { Auth } from '../../../auth/better-auth/auth.config';

import { currentUserId, currentAuthHeaders } from '../../../../common/household/household.context';
import { AccountSettingsService } from '../../../auth/account/account-settings/account-settings.service';
import { AuthInvitation } from '../../../auth/better-auth/invitation/auth-invitation.entity';
import { AuthMember } from '../../../auth/better-auth/member/auth-member.entity';
import { AuthOrganization } from '../../../auth/better-auth/organization/auth-organization.entity';
import { EmailService } from '../../../backoffice/communication/email';
import { JarTemplateService } from '../../../backoffice/reference/template/jar/jar.service';
import { IncomeSource } from '../../product/money/plan/income/income-source.entity';
import { Jar } from '../../product/money/plan/jar/jar.entity';
import {
    DEFAULT_FEATURE_SETTINGS,
    DEFAULT_MONEY_SETTINGS,
    DEFAULT_RITUAL_SETTINGS,
    HouseholdSettings,
} from './household-settings.entity';

@Injectable()
export class HouseholdService {
    constructor(
        @Inject(EntityManager) private readonly em: EntityManager,
        @Inject(AuthService) private readonly authService: AuthService<Auth>,
        @Inject(AccountSettingsService) private readonly accountSettings: AccountSettingsService,
        @Inject(JarTemplateService) private readonly jarTemplates: JarTemplateService,
        @Inject(EmailService) private readonly email: EmailService
    ) {}

    // ====================================================================
    // ? CREATE Operations
    // ====================================================================

    async onboard(input: z.infer<typeof OnboardingInput>) {
        const headers = currentAuthHeaders();
        return this.onboardInternal(input, headers);
    }

    async invite(householdId: string, email: string, role: HouseholdRole) {
        const settings = await this.settings(householdId);
        const planKey = settings.planKey;
        if (!canInviteOnPlan(planKey)) {
            throw new BadRequestException(
                'Basic is solo-only — upgrade to Plus to invite household members'
            );
        }

        const occupied = await this.occupiedSeats(householdId);
        if (!canAddHouseholdMember(planKey, occupied)) {
            const max = capabilitiesFor(planKey).maxMembers;
            throw new BadRequestException(
                max === null
                    ? 'Cannot invite another member right now'
                    : `This plan allows up to ${max} household members (including you)`
            );
        }

        const headers = currentAuthHeaders();
        const result = await this.authService.api.createInvitation({
            body: {
                email,
                role: role.toLowerCase() as 'owner' | 'member' | 'viewer',
                organizationId: householdId,
            },
            headers,
        });
        if (!result?.id) throw new BadRequestException('Could not create invitation');

        const org = await this.em.findOne(AuthOrganization, { id: householdId });
        await this.email.sendHouseholdInvite({
            to: email,
            householdName: org?.name ?? 'Rumbelo',
            inviteUrl: this.email.inviteUrl(result.id),
            role,
        });

        return { invitationId: result.id };
    }

    // ====================================================================
    // ? READ Operations
    // ====================================================================

    async listHouseholds() {
        const userId = currentUserId();
        const memberships = await this.em.find(
            AuthMember,
            { user: userId },
            { populate: ['organization'], orderBy: { organization: { createdAt: 'DESC' } } }
        );
        return memberships.map(member => ({
            id: member.organization.id,
            name: member.organization.name,
            slug: member.organization.slug,
            currency: Currency.EUR,
            periodStartDay: 1,
            createdAt: member.organization.createdAt.toISOString(),
        }));
    }

    async members(householdId: string) {
        const memberships = await this.em.find(
            AuthMember,
            { organization: householdId },
            { populate: ['user'] }
        );
        return memberships.map(member => ({
            id: member.id,
            householdId,
            userId: member.user.id,
            role: mapRole(member.role),
            name: member.user.name,
            email: member.user.email,
            image: member.user.image ?? null,
        }));
    }

    /** Settings row is created lazily so onboarding never has to pre-seed it. */
    async settings(householdId: string) {
        let row = await this.em.findOne(HouseholdSettings, { householdId });
        if (!row) {
            row = this.em.create(HouseholdSettings, { householdId } as never);
            await this.em.persist(row).flush();
        }
        return toSettingsDto(row);
    }

    async current(householdId: string) {
        const org = await this.em.findOne(AuthOrganization, { id: householdId });
        if (!org) throw new BadRequestException('Household not found');

        const settings = await this.settings(householdId);
        return {
            id: org.id,
            name: org.name,
            slug: org.slug,
            currency: settings.currency,
            periodStartDay: settings.money.periodStartDay,
            createdAt: new Date(org.createdAt).toISOString(),
        };
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    async updateSettings(householdId: string, patch: Omit<HouseholdSettingsPatch, 'householdId'>) {
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
            const memberCount = await this.em.count(AuthMember, { organization: householdId });
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

    // ====================================================================
    // Private helpers
    // ====================================================================

    /** Members + pending invites occupy seats against plan.maxMembers. */
    private async occupiedSeats(householdId: string): Promise<number> {
        const members = await this.em.count(AuthMember, { organization: householdId });
        const pending = await this.em.count(AuthInvitation, {
            organization: householdId,
            status: 'pending',
        });
        return members + pending;
    }

    private async onboardInternal(input: z.infer<typeof OnboardingInput>, headers: Headers) {
        const userId = currentUserId();
        const planKey = PlanKey.BASIC;
        const kind = canUseHouseholdKind(planKey, input.kind) ? input.kind : HouseholdKind.SOLO;

        const splitTotal = input.split.reduce(
            (sum: number, share: { percentage: number }) => sum + share.percentage,
            0
        );
        if (Math.abs(splitTotal - 100) > 0.01) {
            throw new BadRequestException(`Jar split must total 100%, received ${splitTotal}%`);
        }

        const slug = slugify(input.householdName);
        const org = await this.authService.api.createOrganization({
            body: { name: input.householdName, slug },
            headers,
        });

        if (!org?.id) throw new BadRequestException('Could not create household');

        await this.authService.api.setActiveOrganization({
            body: { organizationId: org.id },
            headers,
        });

        const splitByKey = new Map(
            input.split.map((share: { key: string; percentage: number }) => [
                share.key.toUpperCase(),
                share.percentage,
            ])
        );

        const templates = await this.jarTemplates.listActive();
        if (templates.length === 0) {
            throw new BadRequestException('Jar catalog is empty — seed backoffice.jar_template');
        }

        for (const meta of templates) {
            const pct = splitByKey.get(meta.key) ?? Number(meta.defaultPercentage);
            this.em.create(Jar, {
                householdId: org.id,
                key: meta.key,
                name: meta.name,
                subtitle: meta.subtitle,
                icon: meta.icon,
                percentage: Number(pct).toFixed(2),
                isSpendable: meta.isSpendable,
                sortOrder: meta.sortOrder,
            } as never);
        }

        this.em.create(HouseholdSettings, {
            householdId: org.id,
            kind,
            planKey,
            currency: input.currency,
            why: input.why,
            moneySettings: {
                ...DEFAULT_MONEY_SETTINGS,
                incomeRhythm: input.incomeRhythm ?? IncomeRhythm.STABLE,
                payoffStrategy: input.payoffStrategy ?? PayoffStrategy.AVALANCHE,
            },
            ritualSettings: { ...DEFAULT_RITUAL_SETTINGS },
            featureSettings: { ...DEFAULT_FEATURE_SETTINGS },
            answers: {},
        } as never);

        await this.accountSettings.upsertForUser(userId, {
            locale: input.locale as never,
            moneyCharacter: input.moneyCharacter,
        });

        if (input.monthlyNetIncome > 0) {
            this.em.create(IncomeSource, {
                householdId: org.id,
                name: 'Netto inkomen',
                kind: IncomeKind.SALARY,
                amount: input.monthlyNetIncome,
                isActive: true,
            } as never);
        }

        await this.em.flush();

        return {
            id: org.id,
            name: org.name,
            slug: org.slug,
            currency: input.currency,
            periodStartDay: 1,
            createdAt: new Date().toISOString(),
        };
    }
}

function slugify(name: string) {
    return (
        name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 80) || 'huishouden'
    );
}

function mapRole(raw: string): HouseholdRole {
    switch (raw.toLowerCase()) {
        case 'owner':
        case 'admin':
            return HouseholdRole.OWNER;
        case 'member':
            return HouseholdRole.MEMBER;
        case 'viewer':
        default:
            return HouseholdRole.VIEWER;
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
    };
}
