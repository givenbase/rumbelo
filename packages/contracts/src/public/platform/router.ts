import { oc } from '@orpc/contract';
import { z } from 'zod';

import { HouseholdRole } from '../../enums';
import * as S from '../../schemas';

/** Platform-level: account prefs, the household itself, and cross-product advisory. */
export const contract = {
    account: {
        /** CREATE */
        createSettings: oc
            .input(S.AccountSettings.partial().omit({ accountId: true }))
            .output(S.AccountSettings),
        /** READ — current authenticated user's settings */
        settings: oc.output(S.AccountSettings),
        /** UPDATE */
        updateSettings: oc
            .input(S.AccountSettings.partial().omit({ accountId: true }))
            .output(S.AccountSettings),
        /** DELETE */
        deleteSettings: oc.input(z.object({ id: S.Id })).output(z.object({ ok: z.literal(true) })),
    },
    household: {
        list: oc.output(z.array(S.Household)),
        current: oc.input(z.object({ householdId: S.HouseholdId })).output(S.Household),
        members: oc.input(S.HouseholdScoped).output(z.array(S.HouseholdMember)),
        settings: oc.input(S.HouseholdScoped).output(S.HouseholdSettings),
        updateSettings: oc.input(S.HouseholdSettingsPatch).output(S.HouseholdSettings),
        onboard: oc.input(S.OnboardingInput).output(S.Household),
        invite: oc
            .input(
                z.object({
                    householdId: S.HouseholdId,
                    email: z.email(),
                    role: z.enum(HouseholdRole),
                })
            )
            .output(z.object({ invitationId: z.string() })),
    },
    coach: {
        feed: oc
            .input(S.HouseholdScoped.extend({ period: S.PeriodKey.nullish() }))
            .output(z.array(S.CoachMessage)),
        dismiss: oc
            .input(z.object({ householdId: S.HouseholdId, id: S.Id }))
            .output(z.object({ ok: z.literal(true) })),
    },
};
