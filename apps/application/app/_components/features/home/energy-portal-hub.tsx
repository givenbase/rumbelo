'use client';

import { useLiveQuery } from '@rumtelo/hooks';

import { apiQuery } from '@/app/_lib/api-hooks';
import { pickPortalCoach } from '@/app/_lib/portal-coach';
import { isLiveData } from '@/app/_lib/preview';
import { energyPortalShell } from '@/app/_lib/portal-hubs';
import { PortalHub, type PortalHubProps } from '@/components/features/home/portal-hub';
import { useAuth } from '@/components/features/shell/auth-provider';

function scoreLabel(score: number | null | undefined): string {
    if (score === null || score === undefined) return '—';
    return String(Math.round(score));
}

export function EnergyPortalHubClient() {
    const { householdId } = useAuth();
    const live = isLiveData(householdId);

    const query = useLiveQuery(
        apiQuery.energy.dashboard.get.queryOptions({
            input: { householdId: householdId! },
        }),
        null,
        live
    );

    const data = query.data;
    const sleep = data?.sleepScore7d;
    const food = data?.foodScore7d;
    const sessions = data?.trainSessionsThisWeek ?? 0;
    const weekDone = data?.weekCheckCompleted === true;

    const props: PortalHubProps = {
        ...energyPortalShell,
        coach: pickPortalCoach(data?.coach ?? [], energyPortalShell.fallbackCoach),
        cards: [
            {
                name: 'Week',
                value: weekDone ? 'Done' : 'Open',
                note: 'week check',
                color: 'var(--color-accent)',
                chart: { kind: 'ring', pct: weekDone ? 100 : 0 },
                href: '/product/energy/week',
            },
            {
                name: 'Sleep',
                value: scoreLabel(sleep),
                note: '7-day score',
                color: 'var(--color-jar-lts)',
                chart: {
                    kind: 'bars',
                    bars:
                        sleep === null || sleep === undefined
                            ? [0, 0, 0, 0, 0, 0, 0]
                            : Array(7).fill(Math.round(sleep)),
                },
                href: '/product/energy/sleep',
            },
            {
                name: 'Training',
                value: String(sessions),
                note: 'sessions this week',
                color: 'var(--color-jar-ff)',
                chart: { kind: 'ring', pct: Math.min(100, sessions * 25) },
                href: '/product/energy/training',
            },
            {
                name: 'Food',
                value: scoreLabel(food),
                note: '7-day score',
                color: 'var(--color-jar-play)',
                chart: {
                    kind: 'ring',
                    pct: food === null || food === undefined ? 0 : Math.round(food),
                },
                href: '/product/energy/food',
            },
        ],
    };

    return <PortalHub {...props} />;
}
