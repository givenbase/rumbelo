import type { z } from 'zod';

import { OnboardingInput } from '@rumbelo/contracts';

import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';

import type { Auth } from '../../auth/auth.config.js';

import { Currency, Locale } from '../../common/database/enums.js';
import { currentUserId, currentAuthHeaders } from '../../common/household/household.context.js';
import { IncomeKind, IncomeSource } from '../money/income/entities/income-source.entity.js';
import { DEFAULT_JAR_SPLIT, Jar, JarKey } from '../money/jar/entities/jar.entity.js';
import { HouseholdSettings } from './entities/index.js';

const JAR_META: {
    key: JarKey;
    name: string;
    subtitle: string;
    icon: string;
    spendable: boolean;
}[] = [
    {
        key: JarKey.NECESSITIES,
        name: 'Necessity',
        subtitle: 'Must-pays',
        icon: '🏠',
        spendable: true,
    },
    {
        key: JarKey.FINANCIAL_FREEDOM,
        name: 'Financial Freedom',
        subtitle: 'Never spend',
        icon: '🔒',
        spendable: false,
    },
    {
        key: JarKey.LONG_TERM_SAVINGS,
        name: 'Long Term Savings',
        subtitle: 'Big things',
        icon: '🎯',
        spendable: true,
    },
    {
        key: JarKey.EDUCATION,
        name: 'Education',
        subtitle: 'Grow yourself',
        icon: '📚',
        spendable: true,
    },
    { key: JarKey.PLAY, name: 'Play', subtitle: 'Guilt-free', icon: '✨', spendable: true },
    {
        key: JarKey.GIVE,
        name: 'Give / foundation',
        subtitle: 'Pass it on',
        icon: '🤲',
        spendable: true,
    },
];

@Injectable()
export class HouseholdService {
    constructor(
        private readonly em: EntityManager,
        private readonly authService: AuthService<Auth>
    ) {}

    /** Settings row is created lazily so onboarding never has to pre-seed it. */
    async settings(householdId: string) {
        let row = await this.em.findOne(HouseholdSettings, { householdId });
        if (!row) {
            row = this.em.create(HouseholdSettings, { householdId } as never);
            await this.em.persistAndFlush(row);
        }
        return toSettingsDto(row);
    }

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

    async listHouseholds() {
        const userId = currentUserId();
        const rows = await this.em
            .getConnection()
            .execute<{ id: string; name: string; slug: string; createdAt: Date }[]>(
                `SELECT o.id, o.name, o.slug, o."createdAt"
         FROM public."organization" o
         JOIN public."member" m ON m."organizationId" = o.id
        WHERE m."userId" = ?
        ORDER BY o."createdAt" DESC`,
                [userId]
            );
        return rows.map(r => ({
            id: r.id,
            name: r.name,
            slug: r.slug,
            currency: Currency.EUR,
            locale: Locale.nl,
            periodStartDay: 1,
            createdAt: new Date(r.createdAt).toISOString(),
        }));
    }

    async members(householdId: string) {
        const rows = await this.em
            .getConnection()
            .execute<
                {
                    id: string;
                    userId: string;
                    role: string;
                    name: string;
                    email: string;
                    image: string | null;
                }[]
            >(
                `SELECT m.id, m."userId", m.role, u.name, u.email, u.image
         FROM public."member" m
         JOIN public."user" u ON u.id = m."userId"
        WHERE m."organizationId" = ?`,
                [householdId]
            );
        return rows.map(r => ({
            id: r.id,
            householdId,
            userId: r.userId,
            role: mapRole(r.role),
            name: r.name,
            email: r.email,
            image: r.image,
        }));
    }

    async current(householdId: string) {
        const rows = await this.em
            .getConnection()
            .execute<{ id: string; name: string; slug: string; createdAt: Date }[]>(
                `SELECT id, name, slug, "createdAt" FROM public."organization" WHERE id = ? LIMIT 1`,
                [householdId]
            );
        const org = rows[0];
        if (!org) throw new BadRequestException('Household not found');

        const settings = await this.settings(householdId);
        return {
            id: org.id,
            name: org.name,
            slug: org.slug,
            currency: settings.currency,
            locale: settings.locale,
            periodStartDay: settings.periodStartDay,
            createdAt: new Date(org.createdAt).toISOString(),
        };
    }

    async onboard(input: z.infer<typeof OnboardingInput>) {
        const headers = currentAuthHeaders();
        return this.onboardInternal(input, headers);
    }

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

        JAR_META.forEach((meta, sortOrder) => {
            const pct = splitByKey.get(meta.key) ?? DEFAULT_JAR_SPLIT[meta.key];
            this.em.create(Jar, {
                householdId: org.id,
                key: meta.key,
                name: meta.name,
                subtitle: meta.subtitle,
                icon: meta.icon,
                percentage: Number(pct).toFixed(2),
                spendable: meta.spendable,
                sortOrder,
            } as never);
        });

        this.em.create(HouseholdSettings, {
            householdId: org.id,
            currency: input.currency,
            locale: input.locale,
            why: input.why,
        } as never);

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

        void userId;
        return {
            id: org.id,
            name: org.name,
            slug: org.slug,
            currency: input.currency,
            locale: input.locale,
            periodStartDay: 1,
            createdAt: new Date().toISOString(),
        };
    }

    async invite(householdId: string, email: string, role: 'OWNER' | 'PARTNER' | 'VIEWER') {
        const headers = currentAuthHeaders();
        const result = await this.authService.api.createInvitation({
            body: {
                email,
                role: role === 'OWNER' ? 'owner' : role === 'PARTNER' ? 'member' : 'viewer',
                organizationId: householdId,
            },
            headers,
        });
        if (!result?.id) throw new BadRequestException('Could not create invitation');
        return { invitationId: result.id };
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

function mapRole(raw: string): 'OWNER' | 'PARTNER' | 'VIEWER' {
    switch (raw.toLowerCase()) {
        case 'owner':
        case 'admin':
            return 'OWNER';
        case 'member':
        case 'partner':
            return 'PARTNER';
        case 'viewer':
        default:
            return 'VIEWER';
    }
}

function toSettingsDto(row: HouseholdSettings) {
    return {
        householdId: row.householdId,
        theme: row.theme,
        locale: row.locale,
        currency: row.currency,
        periodStartDay: row.periodStartDay,
        ritualReminderAt: row.ritualReminderAt,
        ritualReminderDay: row.ritualReminderDay,
        bankSyncEnabled: row.bankSyncEnabled,
        coachEnabled: row.coachEnabled,
        why: row.why,
    };
}
