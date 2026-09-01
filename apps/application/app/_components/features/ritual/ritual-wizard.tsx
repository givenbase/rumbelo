'use client';

import { useState } from 'react';
import { cn } from '@rumbelo/utils';
import { formatMoney } from '@rumbelo/utils';
import { Button, Eyebrow } from '@rumbelo/ui';

interface WizardJar {
  id: string;
  key: string;
  name: string;
  icon: string;
  remaining: number;
  overspent: boolean;
}

const STEPS = [
  {
    key: 'LOOK' as const,
    label: 'Kijken',
    sub: 'Wat gebeurde er deze week?',
  },
  {
    key: 'REDIRECT' as const,
    label: 'Richten',
    sub: 'Waar gaat het overschot heen?',
  },
  {
    key: 'INTEND' as const,
    label: 'Intentie',
    sub: 'Wat is je intentie voor volgende week?',
  },
];

/**
 * Three-step WEEKTELLING wizard (design: `ritual`).
 *
 * Step 1 — Kijken: show week recap per jar (remaining vs allocated).
 * Step 2 — Richten: show surplus amount and let user redirect it to jars.
 * Step 3 — Intentie: free-text intention for the coming week.
 *
 * Step dots at the top double as navigation so users can jump between steps.
 */
export function RitualWizard({
  jars,
  surplus,
  initialStage,
  onStepComplete,
}: {
  jars: readonly WizardJar[];
  surplus: number;
  initialStage?: 'LOOK' | 'REDIRECT' | 'INTEND' | 'DONE';
  onStepComplete?: (
    stage: 'LOOK' | 'REDIRECT' | 'INTEND' | 'DONE',
    payload?: {
      intention?: string;
      allocations?: { jarId: string; amount: number }[];
    },
  ) => Promise<unknown>;
}) {
  const stageIndex = initialStage && initialStage !== 'DONE'
    ? STEPS.findIndex((s) => s.key === initialStage)
    : 0;
  const [step, setStep] = useState(Math.max(0, stageIndex));
  const [intent, setIntent] = useState('');
  const [redirectJarId, setRedirectJarId] = useState<string | null>(null);

  const current = STEPS[step]!;

  async function goNext() {
    if (onStepComplete) {
      const payload =
        current.key === 'REDIRECT' && redirectJarId && surplus > 0
          ? { allocations: [{ jarId: redirectJarId, amount: surplus }] }
          : current.key === 'INTEND'
            ? { intention: intent }
            : undefined;
      await onStepComplete(current.key, payload);
    }
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }

  async function finish() {
    if (onStepComplete) {
      await onStepComplete('DONE', { intention: intent || undefined });
    }
  }

  return (
    <div className="grid gap-6">
      {/* Step indicator strip */}
      <div className="flex items-stretch overflow-hidden rounded-2xl border border-line bg-surface shadow-md">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setStep(i)}
            className={cn(
              'flex flex-1 flex-col gap-1 border-r border-line px-5 py-4 text-left transition-colors last:border-r-0',
              i === step
                ? 'bg-accent-soft'
                : i < step
                  ? 'hover:bg-raised'
                  : 'hover:bg-raised',
            )}
          >
            <span
              className={cn(
                'font-mono text-[9px] font-semibold tracking-[0.18em] uppercase',
                i === step ? 'text-accent' : 'text-fg-faint',
              )}
            >
              Stap {i + 1}
            </span>
            <span
              className={cn(
                'font-display text-sm font-semibold',
                i === step ? 'text-fg' : 'text-fg-secondary',
              )}
            >
              {s.label}
            </span>
            <span className="text-[11px] leading-tight text-fg-faint">{s.sub}</span>
            {/* Progress pip */}
            <span
              className={cn(
                'mt-2 h-0.5 rounded-full transition-colors',
                i === step ? 'bg-accent' : i < step ? 'bg-success' : 'bg-sunken',
              )}
            />
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-[20px] border border-line bg-surface p-6 shadow-md animate-rise">
        {/* ── Stap 1: Kijken ─────────────────────────────────────────── */}
        {current.key === 'LOOK' && (
          <div className="grid gap-5">
            <div>
              <Eyebrow>✦ Kijken</Eyebrow>
              <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-fg">
                Wat deed je deze week?
              </h2>
              <p className="mt-1 text-sm text-fg-muted">
                Geen oordeel. Informatie is alles wat we nodig hebben.
              </p>
            </div>
            <div className="grid gap-2">
              {jars.map((jar) => (
                <div
                  key={jar.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-raised px-4 py-3"
                >
                  <span className="flex items-center gap-2.5 text-sm text-fg">
                    <span aria-hidden className="text-base">{jar.icon}</span>
                    {jar.name}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-sm',
                      jar.overspent ? 'text-danger' : 'text-success',
                    )}
                  >
                    {formatMoney(jar.remaining, { signed: true })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Stap 2: Richten ────────────────────────────────────────── */}
        {current.key === 'REDIRECT' && (
          <div className="grid gap-5">
            <div>
              <Eyebrow>✦ Richten</Eyebrow>
              <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-fg">
                Overschot verdelen
              </h2>
              <p className="mt-1 text-sm text-fg-muted">
                <span className="font-semibold text-fg">{formatMoney(surplus)}</span> staat nog
                zonder richting. Stuur het naar waar het werkt.
              </p>
            </div>
            <div className="grid gap-2">
              {jars
                .filter((j) => j.key !== 'NECESSITIES')
                .map((jar) => (
                  <div
                    key={jar.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-raised px-4 py-3"
                  >
                    <span className="flex items-center gap-2.5 text-sm text-fg">
                      <span aria-hidden className="text-base">{jar.icon}</span>
                      {jar.name}
                    </span>
                    <Button
                      variant={redirectJarId === jar.id ? 'primary' : 'secondary'}
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => setRedirectJarId(jar.id)}
                    >
                      {redirectJarId === jar.id ? 'Geselecteerd' : 'Hierheen'}
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── Stap 3: Intentie ───────────────────────────────────────── */}
        {current.key === 'INTEND' && (
          <div className="grid gap-5">
            <div>
              <Eyebrow>✦ Intentie</Eyebrow>
              <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-fg">
                Mijn intentie voor volgende week
              </h2>
              <p className="mt-1 text-sm text-fg-muted">
                Eén zin. Wat ga je anders doen?
              </p>
            </div>
            <textarea
              rows={4}
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="Schrijf je intentie hier..."
              className="w-full resize-none rounded-xl border border-line bg-raised px-4 py-3 text-sm text-fg placeholder:text-fg-faint transition-colors focus:border-accent focus:outline-none"
              aria-label="Intentie voor volgende week"
            />
            {intent.trim().length > 0 && (
              <p className="text-xs text-fg-muted">
                Goed. Onthoud dit als de week zwaar voelt.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation row */}
      <div className="flex items-center justify-between gap-3">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
            ← Vorige
          </Button>
        ) : (
          <span />
        )}

        {step < STEPS.length - 1 ? (
          <Button onClick={() => void goNext()}>Volgende →</Button>
        ) : (
          <Button onClick={() => void finish()}>Ritueel afronden ✓</Button>
        )}
      </div>
    </div>
  );
}
