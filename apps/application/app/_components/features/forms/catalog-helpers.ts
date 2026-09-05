'use client';

import { useApi, useApiClient } from '@/app/_lib/api-hooks';
import { useLiveQuery } from '@rumbelo/hooks';

import { isLiveData } from '@/app/_lib/preview';
import { useAuth } from '@/components/features/shell/auth-provider';

/** Resolve or create a household category under a jar by display name. */
export async function resolveCategoryId(opts: {
    client: ReturnType<typeof useApiClient>;
    householdId: string;
    jarId: string;
    categoryName: string;
    existing: Array<{ id: string; name: string; archived?: boolean }>;
}): Promise<string | null> {
    const name = opts.categoryName.trim();
    if (!name) return null;
    const found = opts.existing.find(
        c => !c.archived && c.name.toLowerCase() === name.toLowerCase()
    );
    if (found) return found.id;
    const created = await opts.client.money.jars.createCategory({
        householdId: opts.householdId,
        jarId: opts.jarId,
        name,
        budgeted: 0,
    });
    return created.id;
}

export function useCategoryTemplates(enabled: boolean) {
    const api = useApi();
    const { householdId } = useAuth();
    const live = isLiveData(householdId) && enabled;
    return useLiveQuery(
        api.money.catalogs.categoryTemplates.list.queryOptions({
            input: { householdId: householdId! },
        }),
        [],
        live
    );
}
