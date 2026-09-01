'use client';

import * as React from 'react';

import { cn } from '@rumbelo/utils';

import { controlClasses } from '../Input';

/** Native select — default for Rumbelo forms. Use SelectMenu for Radix menus. */
export function Select({
    className,
    children,
    ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select className={cn(controlClasses, 'appearance-none pr-8', className)} {...props}>
            {children}
        </select>
    );
}
