/** Canonical create/update paths for money + growth entities (Meltizo shape). */
export const CREATE_HREF = {
    tx: '/money/transactions/create',
    fixed: '/money/fixed-costs/create',
    debt: '/money/debts/create',
    income: '/growth/income/create',
    goal: '/growth/goals/create',
    session: '/energy/train/create',
    asset: '/growth/assets/create',
    move: '/money/jars/move/create',
} as const;

export type CreateKind = keyof typeof CREATE_HREF;

export function updateHref(kind: Exclude<CreateKind, 'session' | 'asset' | 'move'>, id: string) {
    switch (kind) {
        case 'tx':
            return `/money/transactions/update/${id}`;
        case 'fixed':
            return `/money/fixed-costs/update/${id}`;
        case 'debt':
            return `/money/debts/update/${id}`;
        case 'income':
            return `/growth/income/update/${id}`;
        case 'goal':
            return `/growth/goals/update/${id}`;
    }
}
