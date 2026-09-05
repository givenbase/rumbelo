import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import {
    AccountKind,
    Cadence,
    DebtKind,
    FlowDirection,
    IncomeKind,
    IncomeRhythm,
    Locale,
    MoneyCharacter,
    PayoffStrategy,
    Theme,
    TransactionSource,
    TransactionStatus,
    EnergyMetric,
} from '@rumbelo/contracts';
import { config as loadDotenv } from 'dotenv';

import { loadEnv } from '../../../common/config/env.config';
import { createAuth } from '../../../modules/auth/better-auth/auth.config';
import { AuthMember } from '../../../modules/auth/better-auth/member/auth-member.entity';
import { AuthOrganization } from '../../../modules/auth/better-auth/organization/auth-organization.entity';
import { AuthUser } from '../../../modules/auth/better-auth/user/auth-user.entity';
import { Account } from '../../../modules/auth/account/account.entity';
import { AccountSettings } from '../../../modules/auth/account/account-settings/account-settings.entity';
import { JarTemplate } from '../../../modules/backoffice/product/money/template/jar/jar.entity';
import { HouseholdSettings } from '../../../modules/public/platform/household/household-settings.entity';
import { EnergyLog } from '../../../modules/public/product/energy/log/energy-log.entity';
import { BankAccount } from '../../../modules/public/product/money/ledger/account/bank-account.entity';
import { Transaction } from '../../../modules/public/product/money/ledger/transaction/transaction.entity';
import { FixedCost } from '../../../modules/public/product/money/plan/fixed-cost/fixed-cost.entity';
import { IncomeSource } from '../../../modules/public/product/money/plan/income/income-source.entity';
import { Jar } from '../../../modules/public/product/money/plan/jar/jar.entity';
import { Debt } from '../../../modules/public/product/money/targets/debt/debt.entity';
import { Goal } from '../../../modules/public/product/money/targets/goal/goal.entity';
import { Gratitude } from '../../../modules/public/product/soul/gratitude/gratitude.entity';
import { DEMO_ACCOUNTS, DEMO_PASSWORD, type DemoAccount } from './demo-accounts';

function findRootEnv(): string {
    let dir = dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 10; i++) {
        const candidate = resolve(dir, '.env');
        if (existsSync(candidate)) return candidate;
        dir = resolve(dir, '..');
    }
    return resolve(process.cwd(), '.env');
}

loadDotenv({ path: findRootEnv() });

/**
 * Seeds three plan personas (Basic / Plus / Max) with better-auth users,
 * households, and persona-shaped money boards.
 */
export class DemoHouseholdSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const env = loadEnv();
        const auth = createAuth(env);

        const templates = await em.find(
            JarTemplate,
            { isActive: true },
            { orderBy: { sortOrder: 'ASC' } }
        );
        if (templates.length === 0) {
            throw new Error('DemoHouseholdSeeder: no jar templates — run JarTemplateSeeder first');
        }

        for (const account of DEMO_ACCOUNTS) {
            await this.seedPersona(em, auth, account, templates);
        }
    }

    private async seedPersona(
        em: EntityManager,
        auth: ReturnType<typeof createAuth>,
        demo: DemoAccount,
        templates: JarTemplate[]
    ): Promise<void> {
        let user = await em.findOne(AuthUser, { email: demo.email });
        if (!user) {
            const result = await auth.api.signUpEmail({
                body: {
                    email: demo.email,
                    password: DEMO_PASSWORD,
                    name: demo.name,
                },
            });
            const userId = result?.user?.id;
            if (!userId) {
                throw new Error(`DemoHouseholdSeeder: signUp failed for ${demo.email}`);
            }
            user = await em.findOneOrFail(AuthUser, { id: userId });
        }

        let rumbeloAccount = await em.findOne(Account, { user }, { populate: ['settings'] });
        if (!rumbeloAccount) {
            rumbeloAccount = em.create(Account, { user } as never);
            em.persist(rumbeloAccount);
            const moneyCharacter =
                demo.persona === 'max'
                    ? MoneyCharacter.SAVER
                    : demo.persona === 'plus'
                      ? MoneyCharacter.BALANCED
                      : MoneyCharacter.SPENDER;
            em.create(AccountSettings, {
                account: rumbeloAccount,
                locale: Locale.NL,
                theme: Theme.SYSTEM,
                moneyCharacter,
            } as never);
        }

        let org = await em.findOne(AuthOrganization, { slug: demo.slug });
        if (!org) {
            org = em.create(AuthOrganization, {
                id: randomUUID(),
                name: demo.householdName,
                slug: demo.slug,
                createdAt: new Date(),
            } as never);
            em.persist(org);
            em.create(AuthMember, {
                id: randomUUID(),
                organization: org,
                user,
                role: 'owner',
                createdAt: new Date(),
            } as never);
        }

        const householdId = org.id;
        let settings = await em.findOne(HouseholdSettings, { householdId });
        if (!settings) {
            settings = em.create(HouseholdSettings, {
                householdId,
                why: demo.why,
                planKey: demo.planKey,
                moneySettings: {
                    periodStartDay: 1,
                    incomeRhythm:
                        demo.persona === 'basic' ? IncomeRhythm.STABLE : IncomeRhythm.VARIABLE,
                    payoffStrategy: PayoffStrategy.AVALANCHE,
                },
            } as never);
            em.persist(settings);
        } else {
            settings.planKey = demo.planKey;
            settings.why = demo.why;
            settings.moneySettings = {
                ...settings.moneySettings,
                incomeRhythm:
                    demo.persona === 'basic' ? IncomeRhythm.STABLE : IncomeRhythm.VARIABLE,
            };
        }

        const jarCount = await em.count(Jar, { householdId });
        if (jarCount === 0) {
            for (const meta of templates) {
                em.create(Jar, {
                    householdId,
                    key: meta.key,
                    name: meta.name,
                    subtitle: meta.subtitle,
                    icon: meta.icon,
                    percentage: meta.defaultPercentage,
                    capabilities: { ...meta.capabilities },
                    sortOrder: meta.sortOrder,
                } as never);
            }
        }

        await em.flush();

        const jars = await em.find(Jar, { householdId }, { orderBy: { sortOrder: 'ASC' } });
        const necessities = jars.find(j => j.key === 'NECESSITIES') ?? jars[0]!;
        const ff = jars.find(j => j.key === 'FINANCIAL_FREEDOM') ?? jars[0]!;
        const lts = jars.find(j => j.key === 'LONG_TERM_SAVINGS') ?? jars[0]!;

        const incomeCount = await em.count(IncomeSource, { householdId });
        if (incomeCount === 0) {
            const amount =
                demo.persona === 'basic' ? 180_000 : demo.persona === 'plus' ? 320_000 : 650_000;
            em.create(IncomeSource, {
                householdId,
                name:
                    demo.persona === 'plus'
                        ? 'Freelance'
                        : demo.persona === 'max'
                          ? 'Bedrijf'
                          : 'Salaris',
                kind:
                    demo.persona === 'plus'
                        ? IncomeKind.FREELANCE
                        : demo.persona === 'max'
                          ? IncomeKind.OTHER
                          : IncomeKind.SALARY,
                amount,
                expectedDay: demo.persona === 'plus' ? 15 : 1,
                isActive: true,
                cadence: Cadence.MONTHLY,
            } as never);

            em.create(FixedCost, {
                householdId,
                name: 'Huur',
                amount: demo.persona === 'basic' ? 85_000 : 120_000,
                dueDay: 1,
                isActive: true,
                jar: necessities,
                cadence: Cadence.MONTHLY,
                direction: FlowDirection.OUT,
            } as never);

            em.create(FixedCost, {
                householdId,
                name: 'Boodschappen',
                amount: demo.persona === 'basic' ? 35_000 : 45_000,
                dueDay: 1,
                isActive: true,
                jar: necessities,
                cadence: Cadence.MONTHLY,
                direction: FlowDirection.OUT,
            } as never);

            if (demo.persona !== 'basic') {
                em.create(Debt, {
                    householdId,
                    name: demo.persona === 'plus' ? 'Creditcard' : 'Zakelijke lening',
                    kind: demo.persona === 'plus' ? DebtKind.CREDIT_CARD : DebtKind.LOAN,
                    balance: demo.persona === 'plus' ? 240_000 : 1_200_000,
                    originalBalance: demo.persona === 'plus' ? 300_000 : 1_500_000,
                    interestRate: demo.persona === 'plus' ? '18.90' : '6.50',
                    minimumPayment: demo.persona === 'plus' ? 15_000 : 40_000,
                    dueDay: 20,
                } as never);

                em.create(Goal, {
                    householdId,
                    jar: demo.persona === 'max' ? ff : lts,
                    name: demo.persona === 'max' ? 'Beleggingsbuffer' : 'Noodfonds',
                    target: demo.persona === 'max' ? 2_500_000 : 600_000,
                    saved: demo.persona === 'max' ? 400_000 : 120_000,
                    monthlyContribution: demo.persona === 'max' ? 50_000 : 20_000,
                    why: demo.why,
                } as never);
            }

            let bank = await em.findOne(BankAccount, { householdId });
            if (!bank) {
                bank = em.create(BankAccount, {
                    householdId,
                    name: 'Betaalrekening',
                    kind: AccountKind.CHECKING,
                } as never);
                em.persist(bank);
            }

            const today = new Date().toISOString().slice(0, 10);
            const week = isoWeekKey(new Date());
            em.create(Transaction, {
                householdId,
                account: bank,
                amount: -2_450,
                bookedOn: today,
                description: 'Albert Heijn',
                counterparty: 'AH',
                status: TransactionStatus.INBOX,
                source: TransactionSource.MANUAL,
            } as never);

            if (demo.persona !== 'basic') {
                em.create(Transaction, {
                    householdId,
                    account: bank,
                    jar: necessities,
                    amount: -6_500,
                    bookedOn: today,
                    description: 'OV-chip',
                    status: TransactionStatus.SORTED,
                    source: TransactionSource.MANUAL,
                } as never);

                em.create(EnergyLog, {
                    householdId,
                    userId: user.id,
                    metric: EnergyMetric.SLEEP,
                    value: '72.00',
                    loggedOn: today,
                } as never);

                em.create(Gratitude, {
                    householdId,
                    userId: user.id,
                    week,
                    text: 'Rustige ochtend zonder haast.',
                } as never);
            }
        }

        await em.flush();
    }
}

function isoWeekKey(date: Date): string {
    const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = target.getUTCDay() || 7;
    target.setUTCDate(target.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((target.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
    return `${target.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}
