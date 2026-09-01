'use client';

import { useState } from 'react';

import {
  JarCategoryTable,
  JarDrilldownTrigger,
  type JarDrilldownItem,
} from '@/components/features/money/jar-drilldown-parts';

/** One collapsible jar row — same layout as {@link JarDrilldownTable}. */
export function JarDrilldownRow({ jar }: { jar: JarDrilldownItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line last:border-b-0">
      <JarDrilldownTrigger jar={jar} open={open} onToggle={() => setOpen((v) => !v)} />
      {open && (
        <div className="mb-3 ml-11.5 animate-rise">
          <JarCategoryTable categories={jar.categories} />
        </div>
      )}
    </div>
  );
}
