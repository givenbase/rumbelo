import { Card, Eyebrow, Section } from '@rumbelo/ui';
import { SLEEP_HOURS, mockSleepStages } from '@/app/_mock';

export const metadata = { title: 'Slaap' };

export default function SleepPage() {
  const h = SLEEP_HOURS;

  return (
    <div className="grid animate-rise gap-6">
      <Section eyebrow="Mijn slaap" title="De vloer waar al het andere op staat.">
        <p className="max-w-[62ch] text-[15px] text-fg-muted">
          Slaap is geen budget dat je verdeelt — het is de invoer die bepaalt hoe goed de rest van
          je dag werkt. Diepe slaap maakt je uitgerust; droomslaap maakt je scherp.
        </p>
      </Section>

      <Card className="grid gap-0 p-0">
        {/* ── Slider + stage bar ── */}
        <div className="grid gap-4 p-6">
          {/* Control row */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-fg-muted whitespace-nowrap">
              Slaap per nacht
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
            <span className="min-w-13 font-mono text-[14px] font-medium text-fg">{h}u</span>
            <span className="rounded-full border border-success/25 bg-success/10 px-2.75 py-1.5 font-mono text-[9.5px] font-medium uppercase tracking-widest text-success whitespace-nowrap">
              Goed
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
          <div className="grid grid-cols-[repeat(auto-fit,minmax(clamp(180px,30%,260px),1fr))] gap-3">
            {mockSleepStages.map((s) => (
              <div key={s.name} className="flex min-w-0 items-start gap-2.5">
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-sm"
                  style={{ background: s.color }}
                />
                <div className="grid min-w-0 gap-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-[13.5px] font-semibold text-fg">{s.name}</span>
                    <span
                      className="font-mono text-[12px] font-medium"
                      style={{ color: s.color }}
                    >
                      {s.hours}
                    </span>
                  </div>
                  <span className="text-[12px] leading-relaxed text-fg-muted">{s.does}</span>
                  <span className="font-mono text-[9.5px] font-medium tracking-[0.08em] text-fg-faint whitespace-nowrap">
                    {s.band}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="max-w-[74ch] text-[13px] leading-relaxed text-fg-muted">
            Twee verschillende dingen: diepe slaap maakt je uitgerust, droomslaap maakt je scherp.
            Diepe slaap zit in de eerste uren van de nacht, droomslaap in de laatste — dus een korte
            nacht kost je vooral de scherpte.
          </p>

          {/* Advice callout */}
          <div className="rounded-xl border border-success/25 bg-success/10 px-4 py-3.5">
            <p className="text-[13.5px] leading-relaxed text-fg-secondary">
              Ongeveer 5,3 volledige cycli — delta zit op zijn maximum (1,7u) en je REM-theta ook
              (1,7u). Delta kan niet veel hoger: slow-wave is begrensd op zo'n 1,5 tot 2 uur per
              nacht. Langer slapen levert dus vooral meer theta en REM op — en dat is precies wat je
              bij een korte nacht kwijtraakt.
            </p>
          </div>

          <p className="font-mono text-[10px] font-medium tracking-[0.04em] text-fg-faint leading-relaxed">
            Ruwe schatting op basis van gemiddelde slaapstadia — algemene informatie, geen medisch advies.
          </p>
        </div>

        {/* ── Money cost section ── */}
        <div className="grid gap-3 border-t border-line px-6 py-5">
          <Eyebrow className="text-accent">✦ Wat het je elders kost</Eyebrow>
          <p className="max-w-[72ch] text-[14px] leading-relaxed text-fg-secondary">
            Bij {h} uur betaal je er nergens voor. Je 40 gestuurde uren komen op volle kracht aan,
            en je Play-pot blijft een keuze in plaats van een reflex.
          </p>
        </div>
      </Card>
    </div>
  );
}
