import { productPath } from './routes';

/** Canonical create/update paths for money + growth entities (Meltizo shape). */
export const CREATE_HREF = {
    tx: productPath('money/spending/create'),
    fixed: productPath('money/fixed-costs/create'),
    debt: productPath('money/debt/create'),
    income: productPath('growth/income/create'),
    goal: productPath('growth/goals/create'),
    session: productPath('energy/training/create'),
    asset: productPath('growth/net-worth/create'),
    move: productPath('money/jars/move/create'),
} as const;

export type CreateKind = keyof typeof CREATE_HREF;

export function spendFromJarHref(jarId: string) {
    const params = new URLSearchParams({ jarId });
    return `${CREATE_HREF.tx}?${params.toString()}`;
}

export function updateHref(kind: Exclude<CreateKind, 'session' | 'asset' | 'move'>, id: string) {
    switch (kind) {
        case 'tx':
            return productPath(`money/spending/update/${id}`);
        case 'fixed':
            return productPath(`money/fixed-costs/update/${id}`);
        case 'debt':
            return productPath(`money/debt/update/${id}`);
        case 'income':
            return productPath(`growth/income/update/${id}`);
        case 'goal':
            return productPath(`growth/goals/update/${id}`);
    }
}
