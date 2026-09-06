import { oc } from '@orpc/contract';
import { z } from 'zod';
import * as schemas from '../../../schemas';
import { MoneyCharacter } from '../../platform/enums';

/** Product: Groei — raising earning power, not dividing what already arrived. */
export const contract = {
    levers: {
        list: oc.input(schemas.HouseholdScoped).output(z.array(schemas.IncomeLever)),
    },
    milestones: {
        list: oc.input(schemas.HouseholdScoped).output(z.array(schemas.IncomeMilestone)),
    },
    catalogs: {
        incomePostures: {
            list: oc.input(schemas.HouseholdScoped).output(z.array(schemas.IncomePosture)),
        },
        wealthStages: {
            list: oc.input(schemas.HouseholdScoped).output(z.array(schemas.WealthStage)),
        },
        leverPresets: {
            list: oc
                .input(
                    schemas.HouseholdScoped.extend({
                        postureKey: z.string().max(64).nullish(),
                        character: z.enum(MoneyCharacter).nullish(),
                        stageKey: z.string().max(64).nullish(),
                    })
                )
                .output(z.array(schemas.GrowthLeverPreset)),
        },
    },
};
