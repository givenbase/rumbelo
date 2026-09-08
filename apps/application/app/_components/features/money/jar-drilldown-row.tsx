'use client';

import Link from 'next/link';
import { useState } from 'react';

import { jarKeyToSlug } from '@/app/_lib/jar-slug';
import {
    JarCategoryTable,
    JarDrilldownTrigger,
    type JarDrilldownItem,
} from '@/components/features/money/jar-drilldown-parts';

/** One collapsible jar row — same layout as {@link JarDrilldownTable}. */
export function JarDrilldownRow({ jar }: { jar: JarDrilldownItem }) {
    const [open, setOpen] = useState(false);
    const href = jar.href ?? (jar.key ? `/product/money/jars/${jarKeyToSlug(jar.key)}` : undefined);
    const item = href ? { ...jar, href } : jar;

    return (
        <div className="border-b border-line last:border-b-0">
            <JarDrilldownTrigger
                jar={item}
                open={open}
                onToggle={() => setOpen(previous => !previous)}
            />
            {open && (
                <div className="mb-3 ml-0 animate-rise space-y-2 pl-0 sm:ml-11.5">
                    <JarCategoryTable categories={jar.categories} />
                    {href ? (
                        <Link
                            href={href}
                            className="inline-flex font-mono text-xs font-semibold tracking-wide text-fg-muted uppercase hover:text-accent">
                            Open jar ▸
                        </Link>
                    ) : null}
                </div>
            )}
        </div>
    );
}
