import { Card, Eyebrow, Meter, Section } from '@rumbelo/ui';
import { cn } from '@rumbelo/utils';

import { mockFood } from '@/app/_mock';

export const metadata = { title: 'Nutrition' };

const { weightKg, protToday, kcalToday } = mockFood;
const protTarget = Math.round(weightKg * 1.8);
const kcalTarget = Math.round(weightKg * 33);
const protPct    = Math.min(100, Math.round((protToday / protTarget) * 100));
const kcalPct    = Math.min(100, Math.round((kcalToday / kcalTarget) * 100));

const FOOD_TIE =
  'Groceries are the largest moveable line item within Necessity — roughly €254/month at ' +
  'your split. Eating well is not the expensive part; eating out is. That belongs in Play, and it is ' +
  'the rule that quietly determines whether Necessity stays under 55%.';

const TARGETS = [
  {
    name: 'Protein',
    tag: 'Keep what you build',
    color: 'var(--color-jar-ff)',
    today: `${protToday}g`,
    target: `/ ${protTarget}g`,
    pct: protPct,
    done: protToday >= protTarget,
    note: 'About 1.8g per kg — the range that protects muscle while training. Below that you train and still lose it.',
    quick: ['+20g', '+30g', 'Back'],
  },
  {
    name: 'Calories',
    tag: 'Fuel for the week',
    color: 'var(--color-jar-play)',
    today: kcalToday.toLocaleString('en-US'),
    target: `/ ${kcalTarget.toLocaleString('en-US')}`,
    pct: kcalPct,
    done: kcalToday >= kcalTarget * 0.9,
    note: 'Roughly 33 kcal per kg for an active week. Eating long below that, your training, sleep, and mood pay the price.',
    quick: ['+500', '+800', 'Back'],
  },
] as const;

export default function FoodPage() {
  const headDone = protToday >= protTarget;

  return (
    <div className="grid animate-rise gap-6">
      <Section
        eyebrow="Nutrition"
        title={headDone ? 'Protein is in. The rest is detail.' : `${protTarget - protToday}g protein left today.`}
      >
        <p className="max-w-prose text-base text-fg-muted">
          Two numbers are enough to start: enough protein to keep what you build, and
          enough total to fuel it.
        </p>
      </Section>

      {/* ── Weight slider ── */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface px-5 py-4">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-fg-muted whitespace-nowrap">
          Your weight
        </span>
        <input
          type="range"
          min={45}
          max={140}
          defaultValue={weightKg}
          readOnly
          className="min-w-45 flex-1 accent-accent"
        />
        <span className="min-w-19.5 font-display text-2xl font-semibold tracking-tight text-accent">
          {weightKg} kg
        </span>
      </div>

      {/* ── Macro target cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {TARGETS.map((ft) => (
          <div
            key={ft.name}
            className={cn(
              'grid gap-3 rounded-2xl border border-t-4 border-line bg-surface p-5 shadow-md',
              ft.done && 'border-accent/20',
            )}
            style={{ borderTopColor: ft.color }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-display text-xl font-semibold text-fg">{ft.name}</span>
              <span
                className="font-mono text-xs font-medium uppercase tracking-wide whitespace-nowrap"
                style={{ color: ft.color }}
              >
                {ft.tag}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2">
              <span
                className="font-display text-4xl font-semibold leading-none tracking-tight"
                style={{ color: ft.color }}
              >
                {ft.today}
              </span>
              <span className="font-mono text-xs text-fg-muted">{ft.target}</span>
            </div>

            <Meter value={ft.pct / 100} tone={ft.color} />

            <p className="text-sm leading-relaxed text-fg-muted">{ft.note}</p>

            <div className="flex flex-wrap gap-2">
              {ft.quick.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="rounded-full border border-line-strong px-3.5 py-2 font-mono text-xs font-medium tracking-wide text-fg-secondary transition-colors hover:border-accent-hover hover:text-accent whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tie to the rest ── */}
      <Card className="border-accent/30 shadow-glow">
        <Eyebrow className="mb-3 text-accent">✦ What this costs you</Eyebrow>
        <p className="max-w-prose text-sm leading-relaxed text-fg-secondary">{FOOD_TIE}</p>
      </Card>
    </div>
  );
}
