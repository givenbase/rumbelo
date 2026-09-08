import { productPath } from './routes';

/** Canonical create/update paths for money + growth entities (Meltizo shape). */
export const CREATE_HREF = {
    tx: productPath('money/transactions/create'),
    fixed: productPath('money/fixed-costs/create'),
    debt: productPath('money/debt/create'),
    income: productPath('growth/income/create'),
    goal: productPath('growth/goals/create'),
    session: productPath('energy/training/create'),
    asset: productPath('growth/net-worth/create'),
    move: productPath('money/jars/move/create'),
} as const;

export type CreateKind = keyof typeof CREATE_HREF;

export type TxDirection = 'out' | 'in';

export function spendFromJarHref(jarId: string) {
    const params = new URLSearchParams({ jarId, direction: 'out' });
    return `${CREATE_HREF.tx}?${params.toString()}`;
}

/** Transaction In into a jar (gift, top-up, tax return). */
export function addToJarHref(jarId: string) {
    const params = new URLSearchParams({ jarId, direction: 'in' });
    return `${CREATE_HREF.tx}?${params.toString()}`;
}

/** Open the ledger form (Out / In). */
export function createTxHref(opts?: { jarId?: string; direction?: TxDirection }) {
    const params = new URLSearchParams();
    if (opts?.jarId) params.set('jarId', opts.jarId);
    if (opts?.direction) params.set('direction', opts.direction);
    const qs = params.toString();
    return qs ? `${CREATE_HREF.tx}?${qs}` : CREATE_HREF.tx;
}

/** Open move form; pass fromJarId when already inside a jar. */
export function createMoveHref(opts?: { fromJarId?: string; returnTo?: string }) {
    const params = new URLSearchParams();
    if (opts?.fromJarId) params.set('fromJarId', opts.fromJarId);
    if (opts?.returnTo) params.set('returnTo', opts.returnTo);
    const qs = params.toString();
    return qs ? `${CREATE_HREF.move}?${qs}` : CREATE_HREF.move;
}

export function updateHref(kind: Exclude<CreateKind, 'session' | 'asset' | 'move'>, id: string) {
    switch (kind) {
        case 'tx':
            return productPath(`money/transactions/update/${id}`);
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
