import { Eyebrow } from '@rumbelo/ui';
import { cn } from '@rumbelo/utils';

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
    events,
}: {
    score: number;
    daysLeft: number;
    events: readonly TurnEvent[];
}) {
    return (
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3.5">
                <Eyebrow>✦ The turn</Eyebrow>
                <span className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-medium tracking-widest text-fg-faint uppercase">
                        Month score
                    </span>
                    <span className="font-display text-2xl font-semibold tracking-tight text-accent">
                        {score}
                    </span>
                    <span className="font-mono text-xs text-fg-faint">{daysLeft} days left</span>
                </span>
            </div>

            {/* Event log */}
            <div className="mt-4.5 grid gap-0">
                {events.map((e, i) => (
                    <div
                        key={i}
                        className="flex items-baseline gap-2.5 border-b border-line py-3 last:border-b-0 last:pb-0">
                        <span className="w-14 shrink-0 font-mono text-xs text-fg-faint">
                            {e.day}
                        </span>
                        <span className="min-w-0 flex-1 text-sm text-pretty text-fg-secondary">
                            {e.text}
                        </span>
                        <span
                            className={cn(
                                'shrink-0 font-mono text-xs',
                                e.points < 0 ? 'text-danger' : 'text-success'
                            )}>
                            {e.points > 0 ? `+${e.points}` : e.points}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
