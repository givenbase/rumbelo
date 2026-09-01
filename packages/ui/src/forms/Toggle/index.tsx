'use client';

import type ToggleProps from './types';

import { toggleThumbClass, toggleTrackClass } from './styles';

export function Toggle({ checked, label, hint, onCheckedChange, disabled }: ToggleProps) {
    return (
        <div className="flex items-start justify-between gap-4 py-3">
            <div className="min-w-0">
                <p className="text-sm font-medium text-fg">{label}</p>
                {hint ? <p className="mt-0.5 text-xs text-fg-muted">{hint}</p> : null}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={label}
                disabled={disabled}
                onClick={() => onCheckedChange?.(!checked)}
                className={toggleTrackClass(checked)}>
                <span className={toggleThumbClass(checked)} />
            </button>
        </div>
    );
}

export type { ToggleProps };
