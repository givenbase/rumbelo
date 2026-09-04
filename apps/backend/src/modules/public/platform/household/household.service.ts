import type { z } from 'zod';

import { OnboardingInput } from '@rumbelo/contracts';

import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';

import type { Auth } from '../../../auth/better-auth/auth.config';

import { Currency } from '../../../../common/database/enums';
import { currentUserId, currentAuthHeaders } from '../../../../common/household/household.context';
import { AccountSettingsService } from '../../../auth/account/account-settings/account-settings.service';
import { AuthMember } from '../../../auth/better-auth/member/auth-member.entity';
import { AuthOrganization } from '../../../auth/better-auth/organization/auth-organization.entity';
import { EmailService } from '../../../backoffice/communication/email';
import { JarTemplateService } from '../../../backoffice/reference/jar-template/jar-template.service';
import { IncomeKind, IncomeSource } from '../../product/money/plan/income/income-source.entity';
import { Jar } from '../../product/money/plan/jar/jar.entity';
import { HouseholdSettings } from './household-settings.entity';

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

    async invite(householdId: string, email: string, role: 'OWNER' | 'MEMBER' | 'VIEWER') {
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
        return memberships.map(m => ({
            id: m.organization.id,
            name: m.organization.name,
            slug: m.organization.slug,
            currency: Currency.EUR,
            periodStartDay: 1,
            createdAt: m.organization.createdAt.toISOString(),
        }));
    }

    async members(householdId: string) {
        const memberships = await this.em.find(
            AuthMember,
            { organization: householdId },
            { populate: ['user'] }
        );
        return memberships.map(m => ({
            id: m.id,
            householdId,
            userId: m.user.id,
            role: mapRole(m.role),
            name: m.user.name,
            email: m.user.email,
            image: m.user.image ?? null,
        }));
    }

    /** Settings row is created lazily so onboarding never has to pre-seed it. */
    async settings(householdId: string) {
        let row = await this.em.findOne(HouseholdSettings, { householdId });
        if (!row) {
            row = this.em.create(HouseholdSettings, { householdId } as never);
            await this.em.persistAndFlush(row);
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
            periodStartDay: settings.periodStartDay,
            createdAt: new Date(org.createdAt).toISOString(),
        };
    }

    // ====================================================================
    // ? UPDATE Operations
    // ====================================================================

    async updateSettings(householdId: string, patch: Partial<HouseholdSettings>) {
        const row = await this.em.findOne(HouseholdSettings, { householdId });
        if (!row) {
            const created = this.em.create(HouseholdSettings, { householdId, ...patch } as never);
            await this.em.persistAndFlush(created);
            return toSettingsDto(created);
        }
        Object.assign(row, patch);
        await this.em.flush();
        return toSettingsDto(row);
    }

    // ====================================================================
    // Private helpers
    // ====================================================================

    private async onboardInternal(input: z.infer<typeof OnboardingInput>, headers: Headers) {
        const userId = currentUserId();
        const splitTotal = input.split.reduce(
            (sum: number, s: { percentage: number }) => sum + s.percentage,
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
            input.split.map((s: { key: string; percentage: number }) => [
                s.key.toUpperCase(),
                s.percentage,
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
                spendable: meta.spendable,
                sortOrder: meta.sortOrder,
            } as never);
        }

        this.em.create(HouseholdSettings, {
            householdId: org.id,
            kind: input.kind,
            currency: input.currency,
            why: input.why,
        } as never);

        await this.accountSettings.upsertForUser(userId, { locale: input.locale as never });

        if (input.monthlyNetIncome > 0) {
            this.em.create(IncomeSource, {
                householdId: org.id,
                name: 'Netto inkomen',
                kind: IncomeKind.SALARY,
                amount: input.monthlyNetIncome,
                active: true,
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

function mapRole(raw: string): 'OWNER' | 'MEMBER' | 'VIEWER' {
    switch (raw.toLowerCase()) {
        case 'owner':
        case 'admin':
            return 'OWNER';
        case 'member':
            return 'MEMBER';
        case 'viewer':
        default:
            return 'VIEWER';
    }
}

function toSettingsDto(row: HouseholdSettings) {
    return {
        householdId: row.householdId,
        kind: row.kind,
        currency: row.currency,
        periodStartDay: row.periodStartDay,
        ritualReminderAt: row.ritualReminderAt,
        ritualReminderDay: row.ritualReminderDay,
        bankSyncEnabled: row.bankSyncEnabled,
        coachEnabled: row.coachEnabled,
        why: row.why,
    };
}
