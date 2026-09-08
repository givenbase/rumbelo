'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { PageContentWidth } from '@/components/layout/page-content';

type PageContentWidthContextValue = {
    width: PageContentWidth;
    setWidth: (width: PageContentWidth) => void;
};

const PageContentWidthContext = createContext<PageContentWidthContextValue | null>(null);

/**
 * Lets `PageContent` publish its column width so shell chrome (WhyCaption)
 * can align to the same measure — avoids left-aligned helper vs centered prose.
 */
export function PageContentWidthProvider({ children }: { children: ReactNode }) {
    const [width, setWidth] = useState<PageContentWidth>('full');
    const value = useMemo(() => ({ width, setWidth }), [width]);
    return (
        <PageContentWidthContext.Provider value={value}>
            {children}
        </PageContentWidthContext.Provider>
    );
}

export function usePageContentWidth(): PageContentWidth {
    return useContext(PageContentWidthContext)?.width ?? 'full';
}

/** Client bridge — PageContent stays a Server Component. */
export function RegisterPageContentWidth({ width }: { width: PageContentWidth }) {
    const ctx = useContext(PageContentWidthContext);
    useEffect(() => {
        if (!ctx) return;
        ctx.setWidth(width);
        return () => ctx.setWidth('full');
    }, [ctx, width]);
    return null;
}
