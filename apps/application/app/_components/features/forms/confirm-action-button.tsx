'use client';

import { useState } from 'react';

import { Button, type ButtonProps } from '@rumbelo/ui';

type ConfirmActionButtonProps = {
    label: string;
    confirmLabel: string;
    pendingLabel?: string;
    pending?: boolean;
    onConfirm: () => void;
} & Omit<ButtonProps, 'onClick' | 'children' | 'type'>;

/** Two-click confirm so destructive actions do not use `window.confirm`. */
export function ConfirmActionButton({
    label,
    confirmLabel,
    pendingLabel = 'Deleting…',
    pending,
    disabled,
    onConfirm,
    ...props
}: ConfirmActionButtonProps) {
    const [armed, setArmed] = useState(false);

    return (
        <Button
            type="button"
            disabled={disabled}
            onBlur={() => setArmed(false)}
            onClick={() => {
                if (!armed) {
                    setArmed(true);
                    return;
                }
                setArmed(false);
                onConfirm();
            }}
            {...props}>
            {pending ? pendingLabel : armed ? confirmLabel : label}
        </Button>
    );
}
