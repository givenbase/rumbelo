import { Card, Eyebrow, Section } from '@rumbelo/ui';
import { SLEEP_HOURS, mockSleepStages } from '@/app/_mock';

export const metadata = { title: 'Sleep' };

export default function SleepPage() {
  const h = SLEEP_HOURS;

  return (
    <div className="grid animate-rise gap-6">
      <Section eyebrow="My sleep" title="The floor everything else stands on.">
        <p className="max-w-prose text-base text-fg-muted">
          Sleep is not a budget you distribute — it is the input that determines how well the rest of
          your day works. Deep sleep restores you; REM sleep sharpens you.
        </p>
      </Section>

      <Card className="grid gap-0 p-0">
        {/* ── Slider + stage bar ── */}
        <div className="grid gap-4 p-6">
          {/* Control row */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-fg-muted whitespace-nowrap">
              Sleep per night
            </span>
            <input
              type="range"
              min={4}
              max={10}
              step={0.5}
              defaultValue={h}
              readOnly
              className="min-w-30 max-w-45 flex-1 accent-accent"
            />
            <span className="min-w-13 font-mono text-sm font-medium text-fg">{h}h</span>
            <span className="rounded-full border border-success/25 bg-success/10 px-2.75 py-1.5 font-mono text-xs font-medium uppercase tracking-widest text-success whitespace-nowrap">
              Good
            </span>
          </div>

          {/* Stage colour bar */}
          <div className="flex h-2.5 max-w-115 overflow-hidden rounded-full gap-0.5">
            {mockSleepStages.map((s) => (
              <span
                key={s.name}
                title={s.name}
                className="block h-full"
                style={{ width: `${s.w}%`, background: s.color }}
              />
            ))}
          </div>

          {/* Stage breakdown grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {mockSleepStages.map((s) => (
              <div key={s.name} className="flex min-w-0 items-start gap-2.5">
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-sm"
                  style={{ background: s.color }}
                />
                <div className="grid min-w-0 gap-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-semibold text-fg">{s.name}</span>
                    <span
                      className="font-mono text-xs font-medium"
                      style={{ color: s.color }}
                    >
                      {s.hours}
                    </span>
                  </div>
                  <span className="text-xs leading-relaxed text-fg-muted">{s.does}</span>
                  <span className="font-mono text-xs font-medium tracking-wide text-fg-faint whitespace-nowrap">
                    {s.band}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="max-w-prose text-sm leading-relaxed text-fg-muted">
            Two different things: deep sleep restores you, REM sleep sharpens you.
            Deep sleep comes in the first hours of the night, REM in the last — so a short
            night costs you mainly your sharpness.
          </p>

          {/* Advice callout */}
          <div className="rounded-xl border border-success/25 bg-success/10 px-4 py-3.5">
            <p className="text-sm leading-relaxed text-fg-secondary">
              About 5.3 complete cycles — delta is at its maximum (1.7h) and your REM-theta too
              (1.7h). Delta cannot go much higher: slow-wave is capped at roughly 1.5 to 2 hours per
              night. Sleeping longer mainly adds more theta and REM — which is exactly what you
              lose on a short night.
            </p>
          </div>

          <p className="font-mono text-xs font-medium tracking-normal text-fg-faint leading-relaxed">
            Rough estimate based on average sleep stages — general information, not medical advice.
          </p>
        </div>

        {/* ── Money cost section ── */}
        <div className="grid gap-3 border-t border-line px-6 py-5">
          <Eyebrow className="text-accent">✦ What it costs you elsewhere</Eyebrow>
          <p className="max-w-prose text-sm leading-relaxed text-fg-secondary">
            At {h} hours you pay nothing elsewhere. Your 40 steered hours arrive at full power,
            and your Play jar stays a choice instead of a reflex.
          </p>
        </div>
      </Card>
    </div>
  );
}
