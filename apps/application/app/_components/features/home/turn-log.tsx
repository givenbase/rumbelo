import { cn } from '@rumbelo/utils';
import { Eyebrow } from '@rumbelo/ui';

export interface TurnEvent {
  day: number;
  text: string;
  points: number;
  kind: string;
}

/**
 * Month turn log (design: dashboard "The turn" section).
 *
 * Displays the current Monopoly-framing score, days left, level label, and
 * the timestamped event log for the running month.
 */
export function TurnLog({
  score,
  daysLeft,
  levelLabel,
  events,
}: {
  score: number;
  daysLeft: number;
  levelLabel: string;
  events: readonly TurnEvent[];
}) {
  return (
    <div className="rounded-[20px] border border-line bg-surface p-6 shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <Eyebrow>✦ De beurt</Eyebrow>
          <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] tracking-widest text-fg-muted">
            {levelLabel}
          </span>
        </div>
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-[9.5px] font-medium tracking-[0.18em] text-fg-faint uppercase">
            Maandscore
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-accent">{score}</span>
          <span className="font-mono text-[10px] text-fg-faint">{daysLeft} dagen resterend</span>
        </span>
      </div>

      {/* Event log */}
      <div className="mt-4.5 grid gap-0">
        {events.map((e, i) => (
          <div
            key={i}
            className="grid grid-cols-[52px_minmax(0,1fr)_auto] items-baseline gap-2.5 border-b border-line py-3 last:border-b-0 last:pb-0"
          >
            <span className="font-mono text-[10px] text-fg-faint">{e.day}</span>
            <span className="text-pretty text-[13.5px] text-fg-secondary">{e.text}</span>
            <span
              className={cn(
                'font-mono text-xs',
                e.points < 0 ? 'text-danger' : 'text-success',
              )}
            >
              {e.points > 0 ? `+${e.points}` : e.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
