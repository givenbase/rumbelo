import { oc } from '@orpc/contract';
import { z } from 'zod';
import * as S from '../../../schemas';
import { MoneyCharacter } from '../../platform/enums';

/** Product: Groei — raising earning power, not dividing what already arrived. */
export const contract = {
    levers: {
        list: oc.input(S.HouseholdScoped).output(z.array(S.IncomeLever)),
    },
    milestones: {
        list: oc.input(S.HouseholdScoped).output(z.array(S.IncomeMilestone)),
    },
    catalogs: {
        incomePostures: {
            list: oc.input(S.HouseholdScoped).output(z.array(S.IncomePosture)),
        },
        wealthStages: {
            list: oc.input(S.HouseholdScoped).output(z.array(S.WealthStage)),
        },
        leverPresets: {
            list: oc
                .input(
                    S.HouseholdScoped.extend({
                        postureKey: z.string().max(64).nullish(),
                        character: z.enum(MoneyCharacter).nullish(),
                        stageKey: z.string().max(64).nullish(),
                    })
                )
                .output(z.array(S.GrowthLeverPreset)),
        },
    },
};
