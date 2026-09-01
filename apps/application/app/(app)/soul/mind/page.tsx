'use client';

import { useState } from 'react';
import { Card, Eyebrow, Section } from '@rumbelo/ui';
import { cn } from '@rumbelo/utils';
import { mockMind } from '@/app/_mock';

const MIND_TIE =
  'Een onrustig hoofd stuurt geld niet — het geeft het uit en noemt dat een beslissing. Stilte ' +
  'is niet meditatief, het is strategisch: de enige praktijk hier die niets kost en alle andere ' +
  'beschermt. Elke euro die je niet impulsief uitgeeft is een euro die een pot kiest.';

const PRACTICES = [
  {
    meta: '2–5 min',
    name: 'Ademhaling',
    desc: 'Vier tellen in, zeven vasthouden, acht uit. Eén minuut volstaat als de dag al vol is.',
    color: 'var(--color-jar-lts)',
  },
  {
    meta: '10–20 min',
    name: 'Wandeling',
    desc: 'Zonder doel of telefoon. Het hoofd ruimt op als de voeten bewegen.',
    color: 'var(--color-jar-edu)',
  },
  {
    meta: '5–20 min',
    name: 'Meditatie',
    desc: 'Ogen dicht, aandacht bij de adem. Gedachten komen en gaan — jij bent niet je gedachten.',
    color: 'var(--color-portal-soul)',
  },
  {
    meta: '5–10 min',
    name: 'Journaling',
    desc: 'Drie dingen opschrijven die je aandacht vroegen. Geen analyse, alleen optekenen.',
    color: 'var(--color-jar-give)',
  },
] as const;

export default function MindPage() {
  const [minutes, setMinutes] = useState<number>(mockMind.minutesPerDay);
  const [markedToday, setMarkedToday] = useState(false);

  return (
    <div className="grid animate-rise gap-6">
      <Section eyebrow="Stilte" title="Regie is een ritme, geen stemming.">
        <p className="max-w-[58ch] text-[15px] text-fg-muted">
          De enige praktijk hier die niets kost en al het andere beschermt.
        </p>
      </Section>

      {/* ── Two-column cards ── */}
      <div className="flex flex-wrap items-start gap-4.5">
        {/* Minutes + streak + mark */}
        <div className="grid min-w-[320px] flex-1 gap-4 rounded-[20px] border border-accent/35 bg-surface p-6 shadow-glow">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Eyebrow>Minuten per dag</Eyebrow>
            <div className="flex items-baseline gap-2">
              <Eyebrow>Op rij</Eyebrow>
              <span className="font-display text-[21px] font-semibold leading-none tracking-tight text-accent">
                {mockMind.streak + (markedToday ? 1 : 0)}d
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4.5">
            <input
              type="range"
              min={1}
              max={45}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="min-w-45 flex-1 accent-accent"
            />
            <span className="font-display text-[clamp(32px,5vw,44px)] font-semibold leading-none tracking-tight text-accent whitespace-nowrap">
              {minutes} min
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMarkedToday((p) => !p)}
            className={cn(
              'rounded-full border px-4 py-3.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] transition-all',
              markedToday
                ? 'border-success/25 bg-success/10 text-success'
                : 'border-accent bg-accent text-on-accent hover:brightness-[1.06]',
            )}
          >
            {markedToday ? '✓ Vandaag gedaan' : 'Markeer als gedaan'}
          </button>
        </div>

        {/* Why it's here */}
        <Card className="min-w-70 flex-1">
          <Eyebrow className="mb-3 text-accent">✦ Waarom dit in een geld-app staat</Eyebrow>
          <p className="text-[14px] leading-relaxed text-fg-secondary">{MIND_TIE}</p>
        </Card>
      </div>

      {/* ── Practice cards ── */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(clamp(240px,30%,340px),1fr))] gap-3.5">
        {PRACTICES.map((p) => (
          <div
            key={p.name}
            className="grid gap-2.5 rounded-[16px] border border-line bg-surface p-5 shadow-md"
            style={{ borderTopWidth: 3, borderTopColor: p.color }}
          >
            <span
              className="font-mono text-[9.5px] font-medium uppercase tracking-[0.16em]"
              style={{ color: p.color }}
            >
              {p.meta}
            </span>
            <span className="font-display text-xl font-semibold text-fg">{p.name}</span>
            <span className="text-[13.5px] leading-relaxed text-fg-muted">{p.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
