'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Section } from '@rumbelo/ui';
import { PageContent } from '@/components/layout/page-content';
import { cn } from '@rumbelo/utils';

const CENTRES = [
  { id: 'root',   name: 'Wortel',      gov: 'Overleven',   color: '#dc2626', ask: 'Wat zou je vandaag één stap veiliger maken?' },
  { id: 'sacral', name: 'Heilig',      gov: 'Creativiteit', color: '#ea580c', ask: 'Waar zeg je ja terwijl je nee bedoelt?' },
  { id: 'solar',  name: 'Zonnevlecht', gov: 'Wilskracht',   color: '#ca8a04', ask: 'Welke beslissing stel je uit omdat je moe bent?' },
  { id: 'heart',  name: 'Hart',        gov: 'Liefde',       color: '#16a34a', ask: 'Aan wie geef je vandaag zonder te rekenen?' },
  { id: 'throat', name: 'Keel',        gov: 'Expressie',    color: '#0284c7', ask: 'Welke waarheid zou je week lichter maken als je hem uitspreekt?' },
  { id: 'third',  name: 'Derde oog',   gov: 'Inzicht',      color: '#4f46e5', ask: 'Welk patroon zie je al, maar benoem je nog niet?' },
  { id: 'crown',  name: 'Kroon',       gov: 'Verbinding',   color: '#7c3aed', ask: 'Waarvoor doe je dit echt — los van de cijfers?' },
] as const;

export default function ChakraPage() {
  const [pick, setPick] = useState<(typeof CENTRES)[number] | null>(CENTRES[4]);

  return (
    <PageContent width="prose" className="grid animate-rise gap-6">
      <Section eyebrow="De centra" title="Waar voelt het vast?">
        <p className="max-w-[60ch] text-[15px] text-fg-muted">
          Geen esoterische score — een kaart om te benoemen waar het deze week wringt, zodat je
          intentie ergens op kan landen.
        </p>
      </Section>

      {/* ── Centre picker ── */}
      <div className="grid gap-2">
        {CENTRES.map((c) => {
          const active = pick?.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setPick(active ? null : c)}
              className={cn(
                'grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-all',
                active
                  ? 'border-accent/40 bg-accent-soft'
                  : 'border-line bg-surface hover:border-accent-hover',
              )}
            >
              <span className="size-2.5 rounded-full" style={{ background: c.color }} />
              <span
                className={cn('font-display text-lg font-semibold', active ? 'text-fg' : 'text-fg')}
              >
                {c.name}
              </span>
              <span className="font-mono text-[11px] text-fg-faint">{c.gov}</span>
            </button>
          );
        })}
      </div>

      {/* ── Pick detail callout ── */}
      {pick && (
        <div
          className="animate-rise grid gap-3 rounded-[16px] border border-accent/30 bg-surface p-6 shadow-glow"
          style={{ borderLeftWidth: 3, borderLeftColor: pick.color }}
        >
          <p
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: pick.color }}
          >
            {pick.name}
          </p>
          <p className="max-w-[52ch] font-display text-[clamp(18px,2.2vw,22px)] font-medium leading-snug text-fg">
            {pick.ask}
          </p>
          <Button as={Link} href="/soul/intent" size="sm" className="justify-self-start">
            Zet als intentie →
          </Button>
        </div>
      )}
    </PageContent>
  );
}
