import { v7 as uuidv7 } from 'uuid';

import type { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import {
    AccountKind,
    Cadence,
    DebtKind,
    FlowDirection,
    IncomeKind,
    IncomeStability,
    Locale,
    SpendingStyle,
    PayoffStrategy,
    Theme,
    TransactionSource,
    TransactionStatus,
    EnergyMetric,
} from '@rumbelo/contracts';

import { loadEnv } from '../../../common/config/env.config';
import { loadEnvFiles } from '../../../common/config/load-env';
import { createAuth } from '../../../modules/auth/engine/auth.config';
import { AuthMember } from '../../../modules/auth/household/managed/member/auth-member.entity';
import { AuthHousehold } from '../../../modules/auth/household/managed/household/auth-household.entity';
import { AuthUser } from '../../../modules/auth/user/managed/user/auth-user.entity';
import { Account } from '../../../modules/auth/user/account/account.entity';
import { AccountSettings } from '../../../modules/auth/user/account/account-settings/account-settings.entity';
import { JarTemplate } from '../../../modules/backoffice/product/money/template/jar/jar.entity';
import { HouseholdSettings } from '../../../modules/auth/household/household-settings/household-settings.entity';
import { HouseholdBilling } from '../../../modules/auth/household/household-billing/household-billing.entity';
import { EnergyLog } from '../../../modules/public/product/energy/log/energy-log.entity';
import { BankAccount } from '../../../modules/public/product/money/ledger/account/bank-account.entity';
import { Transaction } from '../../../modules/public/product/money/ledger/transaction/transaction.entity';
import { FixedCost } from '../../../modules/public/product/money/plan/fixed-cost/fixed-cost.entity';
import { IncomeAmountPeriod } from '../../../modules/public/product/money/plan/income/income-amount-period.entity';
import { IncomeSource } from '../../../modules/public/product/money/plan/income/income-source.entity';
import { Jar } from '../../../modules/public/product/money/plan/jar/jar.entity';
import { Debt } from '../../../modules/public/product/money/targets/debt/debt.entity';
import { Goal } from '../../../modules/public/product/money/targets/goal/goal.entity';
import { Gratitude } from '../../../modules/public/product/soul/gratitude/gratitude.entity';
import { DEMO_ACCOUNTS, DEMO_PASSWORD, type DemoAccount } from './demo-accounts';

loadEnvFiles();

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

        await Promise.all(
            DEMO_ACCOUNTS.map(account => this.seedPersona(em.fork(), auth, account, templates))
        );
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
            const spendingStyle =
                demo.persona === 'max'
                    ? SpendingStyle.SAVER
                    : demo.persona === 'plus'
                      ? SpendingStyle.BALANCED
                      : SpendingStyle.SPENDER;
            em.create(AccountSettings, {
                account: rumbeloAccount,
                locale: Locale.NL,
                theme: Theme.SYSTEM,
                spendingStyle,
            } as never);
        }

        let org = await em.findOne(AuthHousehold, { slug: demo.slug });
        if (!org) {
            // Seeder-only insert into BA tables — uuidv7 (same as auth.config generateId).
            org = em.create(AuthHousehold, {
                id: authUuid(),
                name: demo.householdName,
                slug: demo.slug,
                createdAt: new Date(),
            } as never);
            em.persist(org);
            em.create(AuthMember, {
                id: authUuid(),
                household: org,
                user,
                role: 'owner',
                createdAt: new Date(),
            } as never);
        }

        const householdId = org.id;
        let settings = await em.findOne(HouseholdSettings, { household: householdId });
        if (!settings) {
            settings = em.create(HouseholdSettings, {
                household: householdId,
                why: demo.why,
                moneySettings: {
                    periodStartDay: 1,
                    incomeStability:
                        demo.persona === 'basic'
                            ? IncomeStability.STABLE
                            : IncomeStability.VARIABLE,
                    payoffStrategy: PayoffStrategy.AVALANCHE,
                },
            } as never);
            em.persist(settings);
        } else {
            settings.why = demo.why;
            settings.moneySettings = {
                ...settings.moneySettings,
                incomeStability:
                    demo.persona === 'basic' ? IncomeStability.STABLE : IncomeStability.VARIABLE,
            };
        }

        let billing = await em.findOne(HouseholdBilling, { household: householdId });
        if (!billing) {
            billing = em.create(HouseholdBilling, {
                household: householdId,
                planKey: demo.planKey,
            } as never);
            em.persist(billing);
        } else {
            billing.planKey = demo.planKey;
        }

        const jarCount = await em.count(Jar, { household: householdId });
        if (jarCount === 0) {
            for (const meta of templates) {
                em.create(Jar, {
                    household: householdId,
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

        const jars = await em.find(
            Jar,
            { household: householdId },
            { orderBy: { sortOrder: 'ASC' } }
        );
        const necessities = jars.find(j => j.key === 'NECESSITIES') ?? jars[0]!;
        const ff = jars.find(j => j.key === 'FINANCIAL_FREEDOM') ?? jars[0]!;
        const lts = jars.find(j => j.key === 'LONG_TERM_SAVINGS') ?? jars[0]!;

        const incomeCount = await em.count(IncomeSource, { household: householdId });
        if (incomeCount === 0) {
            const amount =
                demo.persona === 'basic' ? 180_000 : demo.persona === 'plus' ? 320_000 : 650_000;
            const startedOn = new Date().toISOString().slice(0, 10);
            const source = em.create(IncomeSource, {
                household: householdId,
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
                startedOn,
            } as never);
            em.create(IncomeAmountPeriod, {
                household: householdId,
                incomeSource: source,
                amount,
                effectiveOn: startedOn,
            } as never);

            em.create(FixedCost, {
                household: householdId,
                name: 'Huur',
                amount: demo.persona === 'basic' ? 85_000 : 120_000,
                dueDay: 1,
                isActive: true,
                jar: necessities,
                cadence: Cadence.MONTHLY,
                direction: FlowDirection.OUT,
            } as never);

            em.create(FixedCost, {
                household: householdId,
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
                    household: householdId,
                    name: demo.persona === 'plus' ? 'Creditcard' : 'Zakelijke lening',
                    kind: demo.persona === 'plus' ? DebtKind.CREDIT_CARD : DebtKind.LOAN,
                    balance: demo.persona === 'plus' ? 240_000 : 1_200_000,
                    originalBalance: demo.persona === 'plus' ? 300_000 : 1_500_000,
                    interestRate: demo.persona === 'plus' ? '18.90' : '6.50',
                    minimumPayment: demo.persona === 'plus' ? 15_000 : 40_000,
                    dueDay: 20,
                } as never);

                em.create(Goal, {
                    household: householdId,
                    jar: demo.persona === 'max' ? ff : lts,
                    name: demo.persona === 'max' ? 'Beleggingsbuffer' : 'Noodfonds',
                    target: demo.persona === 'max' ? 2_500_000 : 600_000,
                    saved: demo.persona === 'max' ? 400_000 : 120_000,
                    monthlyContribution: demo.persona === 'max' ? 50_000 : 20_000,
                    why: demo.why,
                } as never);
            }

            let bank = await em.findOne(BankAccount, { household: householdId });
            if (!bank) {
                bank = em.create(BankAccount, {
                    household: householdId,
                    name: 'Betaalrekening',
                    kind: AccountKind.CHECKING,
                } as never);
                em.persist(bank);
            }

            const today = new Date().toISOString().slice(0, 10);
            const week = isoWeekKey(new Date());
            em.create(Transaction, {
                household: householdId,
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
                    household: householdId,
                    account: bank,
                    jar: necessities,
                    amount: -6_500,
                    bookedOn: today,
                    description: 'OV-chip',
                    status: TransactionStatus.SORTED,
                    source: TransactionSource.MANUAL,
                } as never);

                em.create(EnergyLog, {
                    household: householdId,
                    account: rumbeloAccount.id,
                    metric: EnergyMetric.SLEEP,
                    value: '72.00',
                    loggedOn: today,
                } as never);

                em.create(Gratitude, {
                    household: householdId,
                    account: rumbeloAccount.id,
                    week,
                    text: 'Rustige ochtend zonder haast.',
                } as never);
            }
        }

        await em.flush();
    }
}

/** Uuidv7 for seeder inserts into Better Auth tables (matches auth.config generateId). */
function authUuid(): string {
    return uuidv7();
}

function isoWeekKey(date: Date): string {
    const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = target.getUTCDay() || 7;
    target.setUTCDate(target.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((target.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
    return `${target.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}
