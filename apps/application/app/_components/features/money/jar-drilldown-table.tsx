'use client';

import { useState } from 'react';

import {
    JarCategoryTable,
    JarDrilldownTrigger,
    type JarDrilldownItem,
} from '@/components/features/money/jar-drilldown-parts';

/**
 * Full-table expandable jar list (design: Kluis Finance App.dc.html:422-465).
 */
export function JarDrilldownTable({ jars }: { jars: JarDrilldownItem[] }) {
    const [openId, setOpenId] = useState<string | null>(null);

    return (
        <div className="grid">
            {jars.map(jar => {
                const open = openId === (jar.id ?? jar.name);
                return (
                    <div key={jar.id ?? jar.name} className="border-b border-line last:border-b-0">
                        <JarDrilldownTrigger
                            jar={jar}
                            open={open}
                            onToggle={() => setOpenId(open ? null : (jar.id ?? jar.name))}
                        />
                        {open && (
                            <div className="mb-3 ml-0 animate-rise pl-0 sm:ml-11.5">
                                <JarCategoryTable categories={jar.categories} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
