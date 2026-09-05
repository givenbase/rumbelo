import { Inject } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { contract, type MoneyCharacter } from '@rumbelo/contracts';

import { ControllerSwagger } from '../../../../../common/decorators/controller-swagger.decorators';
import {
    IncomePostureService,
    LeverPresetService,
    WealthStageService,
} from '../../../../backoffice/product';

@ControllerSwagger('growth/catalogs', 'public')
export class GrowthCatalogsController {
    constructor(
        @Inject(LeverPresetService) private readonly levers: LeverPresetService,
        @Inject(IncomePostureService) private readonly postures: IncomePostureService,
        @Inject(WealthStageService) private readonly stages: WealthStageService
    ) {}

    @Implement(contract.growth.catalogs.incomePostures.list)
    listIncomePostures() {
        return implement(contract.growth.catalogs.incomePostures.list).handler(async () =>
            this.postures.listActive()
        );
    }

    @Implement(contract.growth.catalogs.wealthStages.list)
    listWealthStages() {
        return implement(contract.growth.catalogs.wealthStages.list).handler(async () =>
            this.stages.listActive()
        );
    }

    @Implement(contract.growth.catalogs.leverPresets.list)
    listLeverPresets() {
        return implement(contract.growth.catalogs.leverPresets.list).handler(async ({ input }) =>
            this.levers.listActive({
                postureKey: input.postureKey ?? undefined,
                character: (input.character as MoneyCharacter | null) ?? undefined,
                stageKey: input.stageKey ?? undefined,
            })
        );
    }
}
