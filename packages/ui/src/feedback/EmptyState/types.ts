import type { ReactNode } from 'react';

interface EmptyStateProps {
    icon: string;
    title: string;
    body: string;
    action?: ReactNode;
}

export type { EmptyStateProps };
export default EmptyStateProps;
