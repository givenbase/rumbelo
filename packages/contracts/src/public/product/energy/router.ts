import { oc } from '@orpc/contract';
import { z } from 'zod';
import * as schemas from '../../../schemas';

/** Product: Energie — the floor under financial decisions. */
export const contract = {
    logs: {
        list: oc
            .input(
                schemas.HouseholdScoped.extend({
                    from: schemas.IsoDate.nullish(),
                    to: schemas.IsoDate.nullish(),
                })
            )
            .output(z.array(schemas.EnergyLog)),
        create: oc
            .input(schemas.EnergyLog.omit({ id: true, accountId: true }))
            .output(schemas.EnergyLog),
        summary: oc.input(schemas.HouseholdScoped).output(z.array(schemas.EnergySummary)),
    },
    dashboard: {
        get: oc.input(schemas.HouseholdScoped).output(schemas.EnergyDashboard),
    },
    weekCheck: {
        current: oc
            .input(schemas.HouseholdScoped.extend({ week: schemas.WeekKey.nullish() }))
            .output(schemas.EnergyWeekCheck),
        history: oc.input(schemas.HouseholdScoped).output(z.array(schemas.EnergyWeekCheck)),
        complete: oc
            .input(schemas.HouseholdScoped.extend({ week: schemas.WeekKey }))
            .output(schemas.EnergyWeekCheck),
    },
};
