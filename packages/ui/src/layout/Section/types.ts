import type { ReactNode } from 'react';

interface SectionProps {
    eyebrow?: string;
    title?: string;
    action?: ReactNode;
    children?: ReactNode;
    className?: string;
}

export type { SectionProps };
export default SectionProps;
