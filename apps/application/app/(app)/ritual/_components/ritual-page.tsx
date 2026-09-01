'use client';

import { useApi, useApiClient } from '@rumbelo/contracts/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useLiveQuery } from '@rumbelo/hooks';
import { Eyebrow } from '@rumbelo/ui';
import { currentWeekKey, toPeriodKey } from '@rumbelo/utils';

import { isLiveData } from '@/app/_lib/preview';
import { mockJars } from '@/app/_mock';
import { RitualWizard } from '@/components/features/ritual/ritual-wizard';
import { useAppShell } from '@/components/features/shell/app-shell-context';
import { useAuth } from '@/components/features/shell/auth-provider';
import { PageContent } from '@/components/layout/page-content';

export function RitualPageClient() {
    const api = useApi();
    const client = useApiClient();
    const queryClient = useQueryClient();
    const { householdId } = useAuth();
    const { period } = useAppShell();
    const week = currentWeekKey();
    const periodKey = toPeriodKey(period.year, period.month);
    const live = isLiveData(householdId);

    const ritualQuery = useLiveQuery(
        api.money.ritual.current.queryOptions({ input: { householdId: householdId!, week } }),
        {
            id: 'mock',
            householdId: householdId ?? '',
            week,
            stage: 'LOOK' as const,
            surplus: 34_000,
            allocations: [],
            intention: null,
            completedAt: null,
        },
        live
    );

    const jarsQuery = useLiveQuery(
        api.money.jars.balances.queryOptions({
            input: { householdId: householdId!, period: periodKey },
        }),
        mockJars as never,
        live
    );

    const advance = useMutation({
        mutationFn: async (payload: {
            stage: 'LOOK' | 'REDIRECT' | 'INTEND' | 'DONE';
            intention?: string;
            allocations?: { jarId: string; amount: number }[];
        }) => {
            if (!householdId) return;
            return client.money.ritual.advance({
                householdId,
                week,
                stage: payload.stage,
                intention: payload.intention,
                allocations: payload.allocations,
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: api.money.ritual.current.key() });
        },
    });

    const jars = (jarsQuery.data ?? mockJars).map(j => ({
        id: j.id,
        key: j.key,
        name: j.name,
        icon: j.icon ?? '✦',
        remaining: 'remaining' in j ? (j.remaining as number) : 0,
        overspent: 'overspent' in j ? Boolean(j.overspent) : false,
    }));

    const surplus = ritualQuery.data?.surplus ?? 34_000;

    return (
        <PageContent width="narrow" className="grid gap-8">
            <div>
                <Eyebrow>Ten minutes a week</Eyebrow>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg">
                    The weekly ritual
                </h1>
                <p className="mt-2 max-w-prose text-sm text-fg-muted">
                    Rumbelo does not ask for your evenings. One weekly check-in — look, direct, set
                    intention — beats worrying every single day.
                </p>
            </div>

            <RitualWizard
                jars={jars}
                surplus={surplus}
                initialStage={ritualQuery.data?.stage}
                onStepComplete={
                    live
                        ? (stage, payload) =>
                              advance.mutateAsync({
                                  stage,
                                  intention: payload?.intention,
                                  allocations: payload?.allocations,
                              })
                        : undefined
                }
            />
        </PageContent>
    );
}
