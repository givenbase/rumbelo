'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@rumbelo/utils';
import { PageContent } from '@/components/layout/page-content';
import {
  SETTINGS_TABS,
  settingsHref,
  settingsTabFromPathname,
} from '@/app/_lib/settings-tabs';

/**
 * Shared settings chrome. Active section comes from the URL path
 * (`/settings/jars`), not query params — each section is a real page.
 */
export function SettingsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeTab = settingsTabFromPathname(pathname);

  return (
    <PageContent width="wide" className="animate-rise">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Instellingen navigatie">
          <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-fg-muted">
            ✦ Instellingen
          </p>
          <ul className="grid gap-0.5">
            {SETTINGS_TABS.map((tab) => {
              const active = tab.key === activeTab;
              return (
                <li key={tab.key}>
                  <Link
                    href={settingsHref(tab.key)}
                    className={cn(
                      'block rounded-lg px-3 py-2.5 transition-colors',
                      active
                        ? 'bg-accent-soft text-accent'
                        : 'text-fg-secondary hover:bg-raised hover:text-fg',
                    )}
                  >
                    <span
                      className={cn(
                        'block text-sm font-medium',
                        active ? 'text-accent' : 'text-fg',
                      )}
                    >
                      {tab.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-tight text-fg-faint">
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
