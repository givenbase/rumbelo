import { oc } from '@orpc/contract';
import { z } from 'zod';
import * as S from '../../../schemas';

/** Product: Energie — the floor under financial decisions. */
export const contract = {
    logs: {
        list: oc
            .input(S.HouseholdScoped.extend({ from: S.IsoDate.nullish(), to: S.IsoDate.nullish() }))
            .output(z.array(S.EnergyLog)),
        create: oc.input(S.EnergyLog.omit({ id: true, userId: true })).output(S.EnergyLog),
        summary: oc.input(S.HouseholdScoped).output(z.array(S.EnergySummary)),
    },
};
