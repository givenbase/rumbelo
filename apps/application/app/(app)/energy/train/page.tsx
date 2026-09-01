'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Card, Eyebrow, Section } from '@rumbelo/ui';
import { cn } from '@rumbelo/utils';

import { CREATE_HREF } from '@/app/_lib/create-routes';
import { SESSION_COLORS, mockSessions } from '@/app/_mock';
import { ListToolbar } from '@/components/layout/list-toolbar';

const TRAIN_TIE =
  'These 2.5 hours come from the same week where you distribute your jars — most people book them under ' +
  'Play or Education. Training is not a cost item: it is the only spend that enlarges what ' +
  'you can do with the other 37.5 hours. Compare it with Education, which gets 4 hours a week.';

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
      <Section eyebrow="Training" title={done >= total ? 'All sessions done.' : `${total - done} session${total - done === 1 ? '' : 's'} left.`}>
        <p className="max-w-prose text-base text-fg-muted">
          Training is the only investment that pays out in energy rather than euros — and
          energy is what earns the euros.
        </p>
      </Section>

      {/* ── Quick stats ── */}
      <div className="flex flex-wrap gap-6">
        {[
          { label: 'Sessions this week', value: `${done} / ${total}`, color: 'var(--color-accent)' },
          { label: 'Hours active',      value: '2.5h',               color: 'var(--color-jar-lts)' },
          { label: 'On track',          value: `${Math.round((done / total) * 100)}%`, color: 'var(--color-success)' },
        ].map((stat) => (
          <div key={stat.label} className="grid gap-1.5">
            <Eyebrow>{stat.label}</Eyebrow>
            <span
              className="font-display text-2xl lg:text-3xl font-semibold tracking-tight leading-none"
              style={{ color: stat.color }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <ListToolbar
        createLabel="+ Add session"
        onCreate={() => router.push(CREATE_HREF.session)}
      />

      {/* ── Session cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {sessions.map((ss) => {
          const c = color(ss.kind);
          return (
            <div
              key={ss.id}
              className="grid cursor-pointer gap-3 rounded-2xl border border-t-4 border-line bg-surface p-5 shadow-md transition-colors hover:border-accent-hover"
              style={{ borderTopColor: c }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className="font-mono text-xs font-medium uppercase tracking-wide"
                  style={{ color: c }}
                >
                  {ss.kind}
                </span>
                <button
                  type="button"
                  onClick={() => toggle(ss.id)}
                  className={cn(
                    'rounded-full border px-2.75 py-1.5 font-mono text-xs font-medium uppercase tracking-widest transition-colors whitespace-nowrap',
                    ss.done
                      ? 'border-success/25 bg-success/10 text-success'
                      : 'border-line-strong bg-transparent text-fg-muted hover:border-accent-hover hover:text-fg',
                  )}
                >
                  {ss.done ? 'Done' : 'Check off'}
                </button>
              </div>
              <span className="font-display text-xl font-semibold leading-snug text-fg">
                {ss.name}
              </span>
              <span className="font-mono text-xs text-fg-muted">{ss.meta}</span>
            </div>
          );
        })}
      </div>

      {/* ── How this ties to the rest ── */}
      <Card className="border-accent/30 shadow-glow">
        <Eyebrow className="mb-3 text-accent">✦ How this connects to the rest</Eyebrow>
        <p className="max-w-prose text-sm leading-relaxed text-fg-secondary">{TRAIN_TIE}</p>
      </Card>
    </div>
  );
}
