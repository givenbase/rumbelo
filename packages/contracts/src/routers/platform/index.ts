import { oc } from '@orpc/contract';
import { z } from 'zod';
import * as S from '../../schemas/index.js';

/** Platform-level: the tenant itself, and advisory that reads across products. */
export const contract = {
  household: {
    list: oc.output(z.array(S.Household)),
    current: oc.input(z.object({ householdId: S.HouseholdId })).output(S.Household),
    members: oc.input(S.HouseholdScoped).output(z.array(S.HouseholdMember)),
    settings: oc.input(S.HouseholdScoped).output(S.HouseholdSettings),
    updateSettings: oc
      .input(S.HouseholdSettings.partial().extend({ householdId: S.HouseholdId }))
      .output(S.HouseholdSettings),
    onboard: oc.input(S.OnboardingInput).output(S.Household),
    invite: oc
      .input(z.object({ householdId: S.HouseholdId, email: z.email(), role: S.HouseholdRole }))
      .output(z.object({ invitationId: z.string() })),
  },
  coach: {
    feed: oc.input(S.HouseholdScoped.extend({ period: S.PeriodKey.nullish() })).output(z.array(S.CoachMessage)),
    dismiss: oc.input(z.object({ householdId: S.HouseholdId, id: S.Id })).output(z.object({ ok: z.literal(true) })),
  },
};
