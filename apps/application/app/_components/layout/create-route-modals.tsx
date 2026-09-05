'use client';

import { GoalCreatePage, GoalUpdatePage } from '@/product/growth/goals/_components/goal-pages';
import {
    IncomeCreatePage,
    IncomeUpdatePage,
} from '@/product/growth/income/_components/income-pages';
import { DebtCreatePage, DebtUpdatePage } from '@/product/money/debts/_components/debt-pages';
import {
    FixedCostCreatePage,
    FixedCostUpdatePage,
} from '@/product/money/fixed-costs/_components/fixed-cost-pages';
import {
    ExpenseCreatePage,
    ExpenseUpdatePage,
} from '@/product/money/transactions/_components/expense-pages';
import { SheetStubForm } from '@/components/features/forms/sheet-stub-form';
import { RouteModalShell } from '@/components/layout/route-modal-shell';

type ShellProps = {
    closeHref: string;
};

export function TxCreateModalShell({
    closeHref,
    defaultJarId,
}: ShellProps & { defaultJarId?: string }) {
    return (
        <RouteModalShell
            closeHref={closeHref}
            title="New expense"
            description="Note what went out and choose the jar.">
            <ExpenseCreatePage embedded defaultJarId={defaultJarId} />
        </RouteModalShell>
    );
}

export function TxUpdateModalShell({ closeHref, id }: ShellProps & { id: string }) {
    return (
        <RouteModalShell
            closeHref={closeHref}
            title="Edit expense"
            description="Update amount, description or jar.">
            <ExpenseUpdatePage id={id} embedded />
        </RouteModalShell>
    );
}

export function FixedCostCreateModalShell({ closeHref }: ShellProps) {
    return (
        <RouteModalShell
            closeHref={closeHref}
            title="New fixed cost"
            description="What leaves a jar every month?">
            <FixedCostCreatePage embedded />
        </RouteModalShell>
    );
}

export function FixedCostUpdateModalShell({ closeHref, id }: ShellProps & { id: string }) {
    return (
        <RouteModalShell closeHref={closeHref} title="Edit fixed cost">
            <FixedCostUpdatePage id={id} embedded />
        </RouteModalShell>
    );
}

export function DebtCreateModalShell({ closeHref }: ShellProps) {
    return (
        <RouteModalShell
            closeHref={closeHref}
            title="New debt"
            description="Put the debt on the board so you can pay it off.">
            <DebtCreatePage embedded />
        </RouteModalShell>
    );
}

export function DebtUpdateModalShell({ closeHref, id }: ShellProps & { id: string }) {
    return (
        <RouteModalShell closeHref={closeHref} title="Edit debt">
            <DebtUpdatePage id={id} embedded />
        </RouteModalShell>
    );
}

export function IncomeCreateModalShell({ closeHref }: ShellProps) {
    return (
        <RouteModalShell
            closeHref={closeHref}
            title="New income"
            description="Add an income source that feeds your jars.">
            <IncomeCreatePage embedded />
        </RouteModalShell>
    );
}

export function IncomeUpdateModalShell({ closeHref, id }: ShellProps & { id: string }) {
    return (
        <RouteModalShell closeHref={closeHref} title="Edit income">
            <IncomeUpdatePage id={id} embedded />
        </RouteModalShell>
    );
}

export function GoalCreateModalShell({ closeHref }: ShellProps) {
    return (
        <RouteModalShell
            closeHref={closeHref}
            title="New goal"
            description="Give savings a destination.">
            <GoalCreatePage embedded />
        </RouteModalShell>
    );
}

export function GoalUpdateModalShell({ closeHref, id }: ShellProps & { id: string }) {
    return (
        <RouteModalShell closeHref={closeHref} title="Edit goal">
            <GoalUpdatePage id={id} embedded />
        </RouteModalShell>
    );
}

export function AssetCreateModalShell({ closeHref }: ShellProps) {
    return (
        <RouteModalShell closeHref={closeHref} title="New asset">
            <SheetStubForm kind="asset" mode="create" embedded />
        </RouteModalShell>
    );
}

export function SessionCreateModalShell({ closeHref }: ShellProps) {
    return (
        <RouteModalShell closeHref={closeHref} title="New training">
            <SheetStubForm kind="session" mode="create" embedded />
        </RouteModalShell>
    );
}

export function MoveMoneyCreateModalShell({ closeHref }: ShellProps) {
    return (
        <RouteModalShell
            closeHref={closeHref}
            title="Move money"
            description="Move money between jars.">
            <SheetStubForm kind="move" mode="create" embedded />
        </RouteModalShell>
    );
}
