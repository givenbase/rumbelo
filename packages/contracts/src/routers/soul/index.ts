import { oc } from '@orpc/contract';
import { z } from 'zod';
import * as S from '../../schemas/index';

/** Product: Ziel — intention, gratitude, and the reason behind the numbers. */
export const contract = {
    gratitude: {
        list: oc
            .input(S.HouseholdScoped.extend({ week: S.WeekKey.nullish() }))
            .output(z.array(S.Gratitude)),
        create: oc
            .input(
                z.object({
                    householdId: S.HouseholdId,
                    week: S.WeekKey,
                    text: z.string().min(1).max(280),
                })
            )
            .output(S.Gratitude),
    },
};
