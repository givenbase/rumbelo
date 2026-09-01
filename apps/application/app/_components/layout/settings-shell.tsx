'use client';

import type { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@rumbelo/utils';

import { SETTINGS_TABS, settingsHref, settingsTabFromPathname } from '@/app/_lib/settings-tabs';
import { PageContent } from '@/components/layout/page-content';

/**
 * Shared settings chrome. Active section comes from the URL path
 * (`/settings/jars`), not query params — each section is a real page.
 */
export function SettingsShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const activeTab = settingsTabFromPathname(pathname);

    return (
        <PageContent width="wide" className="animate-rise">
            <div className="flex flex-col gap-8 md:flex-row">
                <nav aria-label="Settings navigation" className="md:w-56 md:shrink-0">
                    <p className="mb-3 text-xs font-semibold tracking-widest text-fg-muted uppercase">
                        ✦ Settings
                    </p>
                    <ul className="grid gap-0.5">
                        {SETTINGS_TABS.map(tab => {
                            const active = tab.key === activeTab;
                            return (
                                <li key={tab.key}>
                                    <Link
                                        href={settingsHref(tab.key)}
                                        className={cn(
                                            'block rounded-lg px-3 py-2.5 transition-colors',
                                            active
                                                ? 'bg-accent-soft text-accent'
                                                : 'text-fg-secondary hover:bg-raised hover:text-fg'
                                        )}>
                                        <span
                                            className={cn(
                                                'block text-sm font-medium',
                                                active ? 'text-accent' : 'text-fg'
                                            )}>
                                            {tab.label}
                                        </span>
                                        <span className="mt-0.5 block text-xs leading-tight text-fg-faint">
                                            {tab.sub}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="min-w-0">{children}</div>
            </div>
        </PageContent>
    );
}
