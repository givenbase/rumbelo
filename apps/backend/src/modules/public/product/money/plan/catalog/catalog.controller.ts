import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { contract } from '@rumbelo/contracts';

import { ControllerSwagger } from '../../../../../../common/decorators/controller-swagger.decorators';
import {
    CategoryTemplateService,
    DebtPresetService,
    FixedCostPresetService,
    GoalPresetService,
    IncomeSourcePresetService,
    MerchantPresetService,
} from '../../../../../backoffice/reference';
import type { DebtKind, IncomeKind, JarKey } from '@rumbelo/contracts';

@ControllerSwagger('money/catalogs', 'public')
export class CatalogController {
    constructor(
        @Inject(CategoryTemplateService) private readonly categories: CategoryTemplateService,
        @Inject(FixedCostPresetService) private readonly fixedCosts: FixedCostPresetService,
        @Inject(DebtPresetService) private readonly debts: DebtPresetService,
        @Inject(IncomeSourcePresetService) private readonly incomes: IncomeSourcePresetService,
        @Inject(GoalPresetService) private readonly goals: GoalPresetService,
        @Inject(MerchantPresetService) private readonly merchants: MerchantPresetService
    ) {}

    @Implement(contract.money.catalogs.categoryTemplates.list)
    listCategoryTemplates() {
        return implement(contract.money.catalogs.categoryTemplates.list).handler(
            async ({ input }) => {
                const rows = await this.categories.listActive({
                    jarKey: (input.jarKey as JarKey | null) ?? undefined,
                });
                return rows.map(r => ({
                    key: r.key,
                    name: r.name,
                    sortOrder: r.sortOrder,
                    jarKey: r.jarTemplate.key,
                }));
            }
        );
    }

    @Implement(contract.money.catalogs.fixedCostPresets.list)
    listFixedCostPresets() {
        return implement(contract.money.catalogs.fixedCostPresets.list).handler(async ({ input }) => {
            const rows = await this.fixedCosts.listActive({
                jarKey: (input.jarKey as JarKey | null) ?? undefined,
                categoryTemplateKey: input.categoryTemplateKey ?? undefined,
                audienceTag: input.audienceTag ?? undefined,
            });
            return rows.map(r => ({
                key: r.key,
                name: r.name,
                sortOrder: r.sortOrder,
                jarKey: r.jarTemplate.key,
                categoryTemplateKey: r.categoryTemplateKey,
                defaultCadence: r.defaultCadence,
                suggestedDueDay: r.suggestedDueDay,
                direction: r.direction,
                audienceTags: r.audienceTags,
            }));
        });
    }

    @Implement(contract.money.catalogs.debtPresets.list)
    listDebtPresets() {
        return implement(contract.money.catalogs.debtPresets.list).handler(async ({ input }) => {
            const rows = await this.debts.listActive({
                kind: (input.kind as DebtKind | null) ?? undefined,
            });
            return rows.map(r => ({
                key: r.key,
                name: r.name,
                sortOrder: r.sortOrder,
                kind: r.kind,
            }));
        });
    }

    @Implement(contract.money.catalogs.incomeSourcePresets.list)
    listIncomeSourcePresets() {
        return implement(contract.money.catalogs.incomeSourcePresets.list).handler(
            async ({ input }) => {
                const rows = await this.incomes.listActive({
                    kind: (input.kind as IncomeKind | null) ?? undefined,
                });
                return rows.map(r => ({
                    key: r.key,
                    name: r.name,
                    sortOrder: r.sortOrder,
                    kind: r.kind,
                    defaultCadence: r.defaultCadence,
                }));
            }
        );
    }

    @Implement(contract.money.catalogs.goalPresets.list)
    listGoalPresets() {
        return implement(contract.money.catalogs.goalPresets.list).handler(async ({ input }) => {
            const rows = await this.goals.listActive({
                jarKey: (input.jarKey as JarKey | null) ?? undefined,
            });
            return rows.map(r => ({
                key: r.key,
                name: r.name,
                sortOrder: r.sortOrder,
                jarKey: r.jarTemplate.key,
                categoryTemplateKey: r.categoryTemplateKey,
                icon: r.icon,
            }));
        });
    }

    @Implement(contract.money.catalogs.merchantPresets.list)
    listMerchantPresets() {
        return implement(contract.money.catalogs.merchantPresets.list).handler(async ({ input }) => {
            const rows = await this.merchants.listActive({
                jarKey: (input.jarKey as JarKey | null) ?? undefined,
                categoryTemplateKey: input.categoryTemplateKey ?? undefined,
                mcc: input.mcc ?? undefined,
            });
            return rows.map(r => ({
                key: r.key,
                name: r.name,
                sortOrder: r.sortOrder,
                matchValue: r.matchValue,
                aliases: r.aliases,
                mcc: r.mcc,
                jarKey: r.jarTemplate.key,
                categoryTemplateKey: r.categoryTemplateKey,
            }));
        });
    }
}
