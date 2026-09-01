'use client';

import type FieldProps from './types';

export function Field({ label, hint, children, htmlFor }: FieldProps) {
    return (
        <div className="grid gap-1.5">
            <label htmlFor={htmlFor} className="text-sm font-medium text-fg">
                {label}
            </label>
            {children}
            {hint ? <p className="text-xs text-fg-muted">{hint}</p> : null}
        </div>
    );
}

export type { FieldProps };
