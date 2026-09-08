'use client';

import Link from 'next/link';
import { useState } from 'react';

import { jarKeyToSlug } from '@/app/_lib/jar-slug';
import {
    JarCategoryTable,
    JarDrilldownTrigger,
    type JarDrilldownItem,
} from '@/components/features/money/jar-drilldown-parts';

function jarHref(jar: JarDrilldownItem): string | undefined {
    if (jar.href) return jar.href;
    if (jar.key) return `/product/money/jars/${jarKeyToSlug(jar.key)}`;
    return undefined;
}

/**
 * Full-table expandable jar list (design: Kluis Finance App.dc.html:422-465).
 * Row opens the jar; chevron expands categories.
 */
export function JarDrilldownTable({ jars }: { jars: JarDrilldownItem[] }) {
    const [openId, setOpenId] = useState<string | null>(null);

    return (
        <div className="grid">
            {jars.map(jar => {
                const id = jar.id ?? jar.name;
                const open = openId === id;
                const href = jarHref(jar);
                const item = href ? { ...jar, href } : jar;

                return (
                    <div key={id} className="border-b border-line last:border-b-0">
                        <JarDrilldownTrigger
                            jar={item}
                            open={open}
                            onToggle={() => setOpenId(open ? null : id)}
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
            })}
        </div>
    );
}
