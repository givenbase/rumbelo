import { oc } from '@orpc/contract';
import { z } from 'zod';
import * as S from '../../schemas/index';

/** Product: Groei — raising earning power, not dividing what already arrived. */
export const contract = {
    levers: {
        list: oc.input(S.HouseholdScoped).output(z.array(S.IncomeLever)),
    },
    milestones: {
        list: oc.input(S.HouseholdScoped).output(z.array(S.IncomeMilestone)),
    },
};
