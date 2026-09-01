import type { ReactNode } from 'react';

interface FieldProps {
    label: string;
    hint?: string;
    children: ReactNode;
    htmlFor?: string;
}

export type { FieldProps };
export default FieldProps;
