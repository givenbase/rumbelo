import Link from 'next/link';

import { cn } from '@rumbelo/utils';

import type { FormRouteWidth } from '@/app/_lib/form-route-meta';

type FormRoutePageShellProps = {
    children: React.ReactNode;
    closeHref?: string;
    description?: string;
    title: string;
    width?: FormRouteWidth;
};

/**
 * Full-page twin of RouteModalShell — same header tokens, card chrome, and body padding
 * so hard-refresh / direct URL create+update match the soft-nav sheet.
 */
export function FormRoutePageShell({
    children,
    closeHref,
    description,
    title,
    width = 'default',
}: FormRoutePageShellProps) {
    return (
        <div className="animate-rise px-4 py-6 sm:py-10">
            <div className={cn('mx-auto w-full', width === 'wide' ? 'max-w-lg' : 'max-w-md')}>
                {closeHref ? (
                    <Link
                        href={closeHref}
                        className="mb-3 inline-flex text-sm font-medium text-fg-muted transition-colors hover:text-fg">
                        ← Back
                    </Link>
                ) : null}
                <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
                    <header className="border-b border-line bg-raised px-5 py-4">
                        <div className="space-y-1">
                            <h1 className="font-display text-lg font-semibold tracking-tight text-fg">
                                {title}
                            </h1>
                            {description ? (
                                <p className="text-sm text-fg-muted">{description}</p>
                            ) : null}
                        </div>
                    </header>
                    <div className="p-5">{children}</div>
                </div>
            </div>
        </div>
    );
}
