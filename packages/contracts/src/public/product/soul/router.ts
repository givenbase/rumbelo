import { oc } from '@orpc/contract';
import { z } from 'zod';
import * as schemas from '../../../schemas';

/** Product: Ziel — intention, gratitude, and the reason behind the numbers. */
export const contract = {
    gratitude: {
        list: oc
            .input(schemas.HouseholdScoped.extend({ week: schemas.WeekKey.nullish() }))
            .output(z.array(schemas.Gratitude)),
        create: oc
            .input(
                z.object({
                    householdId: schemas.HouseholdId,
                    week: schemas.WeekKey,
                    text: z.string().min(1).max(280),
                })
            )
            .output(schemas.Gratitude),
    },
    weekCheck: {
        current: oc
            .input(schemas.HouseholdScoped.extend({ week: schemas.WeekKey.nullish() }))
            .output(schemas.SoulWeekCheck),
        history: oc.input(schemas.HouseholdScoped).output(z.array(schemas.SoulWeekCheck)),
        complete: oc
            .input(schemas.HouseholdScoped.extend({ week: schemas.WeekKey }))
            .output(schemas.SoulWeekCheck),
    },
};
