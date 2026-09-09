'use client';

import * as React from 'react';

import { Input } from '@rumtelo/ui';

import { ignorePasswordManagers, safeAutofillName } from '@/app/_lib/ignore-password-managers';

/**
 * Money-form text input — same as UI Input, but hard-discourages browser /
 * password-manager autofill (Chrome + LastPass ignore a plain autocomplete=off).
 */
export const FormInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(function FormInput({ name, onFocus, ...props }, ref) {
    return (
        <Input
            ref={ref}
            {...props}
            name={safeAutofillName(name)}
            {...ignorePasswordManagers}
            readOnly
            onFocus={event => {
                // Managers scan on paint; unlocking on focus stops most injections.
                event.currentTarget.removeAttribute('readonly');
                onFocus?.(event);
            }}
        />
    );
});
