'use client';

import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@rumbelo/ui';

import { PLAN_LABELS, type PlanChangeDiff, type PlanKey } from '@/app/_lib/plan';

type PlanChangeDialogProps = {
    open: boolean;
    diff: PlanChangeDiff | null;
    busy?: boolean;
    /** When true, confirm continues to Stripe Checkout (paid upgrade). */
    stripeCheckout?: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
};

function ChangeList({
    title,
    tone,
    items,
}: {
    title: string;
    tone: 'gain' | 'loss';
    items: { name: string; description: string }[];
}) {
    if (items.length === 0) return null;
    return (
        <div className="grid gap-1.5">
            <p
                className={
                    tone === 'gain'
                        ? 'font-mono text-[10px] font-medium tracking-widest text-accent uppercase'
                        : 'font-mono text-[10px] font-medium tracking-widest text-fg-muted uppercase'
                }>
                {title}
            </p>
            <ul className="grid gap-1.5">
                {items.map(item => (
                    <li
                        key={item.name + item.description}
                        className="rounded-md border border-line bg-raised/40 px-2.5 py-1.5">
                        <span className="text-sm font-medium text-fg">{item.name}</span>
                        <p className="text-xs leading-snug text-fg-muted">{item.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** Confirm upgrade / downgrade with capability + limit deltas. */
export function PlanChangeDialog({
    open,
    diff,
    busy = false,
    stripeCheckout = false,
    onOpenChange,
    onConfirm,
}: PlanChangeDialogProps) {
    if (!diff) return null;

    const toLabel = PLAN_LABELS[diff.to as PlanKey];
    const fromLabel = PLAN_LABELS[diff.from as PlanKey];
    const upgrading = diff.direction === 'upgrade';

    const confirmLabel = busy
        ? '…'
        : stripeCheckout
          ? `Continue to pay — ${toLabel}`
          : upgrading
            ? `Upgrade to ${toLabel}`
            : `Downgrade to ${toLabel}`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[min(90vh,40rem)] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {upgrading ? `Upgrade to ${toLabel}?` : `Downgrade to ${toLabel}?`}
                    </DialogTitle>
                    <DialogDescription>
                        {upgrading
                            ? `You are moving from ${fromLabel} to ${toLabel}. Review what unlocks before you continue.`
                            : `You are moving from ${fromLabel} to ${toLabel}. Features below will be disabled until you upgrade again — your data stays.`}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-1">
                    <ChangeList title="You unlock" tone="gain" items={diff.gained} />
                    <ChangeList
                        title="Disabled on this plan"
                        tone="loss"
                        items={diff.lost}
                    />

                    {diff.limitChanges.length > 0 ? (
                        <div className="grid gap-1.5">
                            <p className="font-mono text-[10px] font-medium tracking-widest text-fg-muted uppercase">
                                Limits
                            </p>
                            <ul className="grid gap-1">
                                {diff.limitChanges.map(change => (
                                    <li
                                        key={change.label}
                                        className="flex flex-wrap items-baseline gap-x-2 text-xs text-fg-secondary">
                                        <span className="font-medium text-fg">{change.label}</span>
                                        <span className="text-fg-faint">{change.from}</span>
                                        <span aria-hidden>→</span>
                                        <span className={change.expanded ? 'text-accent' : 'text-fg'}>
                                            {change.to}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {diff.kindNotes.map(note => (
                        <p key={note} className="text-xs leading-snug text-fg-muted">
                            {note}
                        </p>
                    ))}

                    {!upgrading ? (
                        <p className="rounded-md border border-line bg-surface px-2.5 py-2 text-xs leading-snug text-fg-secondary">
                            Nothing you have entered is deleted. Gated screens and actions stay
                            locked until you return to a higher plan.
                        </p>
                    ) : null}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={busy}
                        onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant={upgrading ? 'primary' : 'secondary'}
                        disabled={busy}
                        onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
