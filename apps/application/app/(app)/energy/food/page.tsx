import { Card, Eyebrow, Meter, Section } from '@rumbelo/ui';
import { mockFood } from '@/app/_mock';

export const metadata = { title: 'Voeding' };

const { weightKg, protToday, kcalToday } = mockFood;
const protTarget = Math.round(weightKg * 1.8);
const kcalTarget = Math.round(weightKg * 33);
const protPct    = Math.min(100, Math.round((protToday / protTarget) * 100));
const kcalPct    = Math.min(100, Math.round((kcalToday / kcalTarget) * 100));

const FOOD_TIE =
  'Boodschappen zijn de grootste beweegbare regel binnen Noodzaak — ruwweg €254 per maand bij ' +
  'jouw verdeling. Goed eten is niet het dure deel; uit eten is dat. Die hoort in Play, en het is ' +
  'de regel die stil bepaalt of Noodzaak onder 55% blijft.';

const TARGETS = [
  {
    name: 'Eiwitten',
    tag: 'Houd wat je opbouwt',
    color: 'var(--color-jar-ff)',
    today: `${protToday}g`,
    target: `/ ${protTarget}g`,
    pct: protPct,
    done: protToday >= protTarget,
    note: 'Ongeveer 1,8g per kilo — het bereik dat spieren beschermt tijdens trainen. Eronder train je en verlies je het toch.',
    quick: ['+20g', '+30g', 'Terug'],
  },
  {
    name: 'Calorieën',
    tag: 'Brandstof voor de week',
    color: 'var(--color-jar-play)',
    today: kcalToday.toLocaleString('nl-NL'),
    target: `/ ${kcalTarget.toLocaleString('nl-NL')}`,
    pct: kcalPct,
    done: kcalToday >= kcalTarget * 0.9,
    note: 'Ruwweg 33 kcal per kilo bij een actieve week. Eet je er lang onder, dan betalen je training, slaap en humeur ervoor.',
    quick: ['+500', '+800', 'Terug'],
  },
] as const;

export default function FoodPage() {
  const headDone = protToday >= protTarget;

  return (
    <div className="grid animate-rise gap-6">
      <Section
        eyebrow="Voeding"
        title={headDone ? 'Eiwit zit erin. De rest is detail.' : `Nog ${protTarget - protToday}g eiwit te gaan vandaag.`}
      >
        <p className="max-w-[62ch] text-[15px] text-fg-muted">
          Twee getallen zijn genoeg om te beginnen: genoeg eiwit om te houden wat je opbouwt, en
          genoeg totaal om het te voeden.
        </p>
      </Section>

      {/* ── Weight slider ── */}
      <div className="flex flex-wrap items-center gap-4 rounded-[14px] border border-line bg-surface px-5 py-4">
        <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-fg-muted whitespace-nowrap">
          Je gewicht
        </span>
        <input
          type="range"
          min={45}
          max={140}
          defaultValue={weightKg}
          readOnly
          className="min-w-45 flex-1 accent-accent"
        />
        <span className="min-w-19.5 font-display text-[26px] font-semibold tracking-tight text-accent">
          {weightKg} kg
        </span>
      </div>

      {/* ── Macro target cards ── */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(clamp(240px,45%,420px),1fr))] gap-3.5">
        {TARGETS.map((ft) => (
          <div
            key={ft.name}
            className="grid gap-3 rounded-[16px] border bg-surface p-5.5 shadow-md"
            style={{
              borderTopWidth: 3,
              borderTopColor: ft.color,
              borderColor: ft.done ? 'color-mix(in srgb, currentColor 20%, transparent)' : undefined,
            }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-display text-xl font-semibold text-fg">{ft.name}</span>
              <span
                className="font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] whitespace-nowrap"
                style={{ color: ft.color }}
              >
                {ft.tag}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2">
              <span
                className="font-display text-[34px] font-semibold leading-none tracking-tight"
                style={{ color: ft.color }}
              >
                {ft.today}
              </span>
              <span className="font-mono text-[12px] text-fg-muted">{ft.target}</span>
            </div>

            <Meter value={ft.pct / 100} tone={ft.color} />

            <p className="text-[13px] leading-relaxed text-fg-muted">{ft.note}</p>

            <div className="flex flex-wrap gap-2">
              {ft.quick.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="rounded-full border border-line-strong px-3.5 py-2 font-mono text-[10.5px] font-medium tracking-[0.08em] text-fg-secondary transition-colors hover:border-accent-hover hover:text-accent whitespace-nowrap"
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
        <Eyebrow className="mb-3 text-accent">✦ Wat dit je kost</Eyebrow>
        <p className="max-w-[74ch] text-[14px] leading-relaxed text-fg-secondary">{FOOD_TIE}</p>
      </Card>
    </div>
  );
}
