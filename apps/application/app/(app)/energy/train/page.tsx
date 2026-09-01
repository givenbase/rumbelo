'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Eyebrow, Section } from '@rumbelo/ui';
import { cn } from '@rumbelo/utils';
import { SESSION_COLORS, mockSessions } from '@/app/_mock';
import { CREATE_HREF } from '@/app/_lib/create-routes';
import { ListToolbar } from '@/components/layout/list-toolbar';

const TRAIN_TIE =
  'Deze 2,5 uur komen uit dezelfde week die je potten verdelen — de meeste mensen boeken ze op ' +
  'Play of Education. Trainen is echter geen kostenpost: het is de enige uitgave die vergroot wat ' +
  'je met de andere 37,5 uur kunt doen. Vergelijk het met Education, die 4 uur per week krijgt.';

export default function TrainPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState(mockSessions.map((s) => ({ ...s })));

  const done  = sessions.filter((s) => s.done).length;
  const total = sessions.length;
  const color = (kind: string) => SESSION_COLORS[kind] ?? 'var(--color-fg-muted)';

  const toggle = (id: string) =>
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));

  return (
    <div className="grid animate-rise gap-6">
      <Section eyebrow="Trainen" title={done >= total ? 'Alle sessies zitten erin.' : `Nog ${total - done} sessie${total - done === 1 ? '' : 's'} te gaan.`}>
        <p className="max-w-[62ch] text-[15px] text-fg-muted">
          Trainen is de enige investering die in energie uitbetaalt in plaats van euro's — en
          energie is wat de euro's verdient.
        </p>
      </Section>

      {/* ── Quick stats ── */}
      <div className="flex flex-wrap gap-6">
        {[
          { label: 'Sessies deze week', value: `${done} / ${total}`, color: 'var(--color-accent)' },
          { label: 'Uren actief',       value: '2,5u',               color: 'var(--color-jar-lts)' },
          { label: 'Op koers',          value: `${Math.round((done / total) * 100)}%`, color: 'var(--color-success)' },
        ].map((stat) => (
          <div key={stat.label} className="grid gap-1.5">
            <Eyebrow>{stat.label}</Eyebrow>
            <span
              className="font-display text-[clamp(24px,3.4vw,31px)] font-semibold tracking-tight leading-none"
              style={{ color: stat.color }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <ListToolbar
        createLabel="+ Sessie toevoegen"
        onCreate={() => router.push(CREATE_HREF.session)}
      />

      {/* ── Session cards ── */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(clamp(240px,31%,400px),1fr))] gap-3.5">
        {sessions.map((ss) => {
          const c = color(ss.kind);
          return (
            <div
              key={ss.id}
              className="grid cursor-pointer gap-3 rounded-[16px] border border-line bg-surface p-5 shadow-md transition-colors hover:border-accent-hover"
              style={{ borderTopWidth: 3, borderTopColor: c }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className="font-mono text-[9.5px] font-medium uppercase tracking-[0.14em]"
                  style={{ color: c }}
                >
                  {ss.kind}
                </span>
                <button
                  type="button"
                  onClick={() => toggle(ss.id)}
                  className={cn(
                    'rounded-full border px-2.75 py-1.5 font-mono text-[9.5px] font-medium uppercase tracking-widest transition-colors whitespace-nowrap',
                    ss.done
                      ? 'border-success/25 bg-success/10 text-success'
                      : 'border-line-strong bg-transparent text-fg-muted hover:border-accent-hover hover:text-fg',
                  )}
                >
                  {ss.done ? 'Gedaan' : 'Afvinken'}
                </button>
              </div>
              <span className="font-display text-[19px] font-semibold leading-snug text-fg">
                {ss.name}
              </span>
              <span className="font-mono text-[11.5px] text-fg-muted">{ss.meta}</span>
            </div>
          );
        })}
      </div>

      {/* ── How this ties to the rest ── */}
      <Card className="border-accent/30 shadow-glow">
        <Eyebrow className="mb-3 text-accent">✦ Hoe dit aan de rest hangt</Eyebrow>
        <p className="max-w-[74ch] text-[14px] leading-relaxed text-fg-secondary">{TRAIN_TIE}</p>
      </Card>
    </div>
  );
}
