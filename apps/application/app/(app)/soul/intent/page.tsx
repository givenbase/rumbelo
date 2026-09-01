import { Eyebrow, Section } from '@rumbelo/ui';
import { PageContent } from '@/components/layout/page-content';
import { cn } from '@rumbelo/utils';
import { IntentStillnessLink } from './_components/intent-stillness-link';

export const metadata = { title: 'Intentie' };

const CURRENT_INTENT = 'Tien minuten stilte vóór ik mijn inbox open.';

export default function IntentPage() {
  const hasIntent = Boolean(CURRENT_INTENT);

  return (
    <PageContent width="narrow" className="grid animate-rise gap-6">
      <Section eyebrow="Intentie" title="Eén zin voor deze week.">
        <p className="max-w-[54ch] text-[15px] text-fg-muted">
          Geen goed voornemen. Een instructie aan jezelf, klein genoeg om te houden.
        </p>
      </Section>

      {/* ── Intent card ── */}
      <div className="grid gap-4 rounded-[18px] border border-accent/35 bg-surface p-6 shadow-glow">
        <Eyebrow>Mijn intentie</Eyebrow>

        <input
          type="text"
          defaultValue={CURRENT_INTENT}
          placeholder="Schrijf één zin voor deze week…"
          className={cn(
            'w-full rounded-xl border border-line-strong bg-raised px-4 py-4',
            'font-display text-[clamp(17px,2.2vw,21px)] text-fg tracking-tight',
            'placeholder:text-fg-faint',
            'transition-colors focus:border-accent focus:outline-none',
          )}
        />

        {hasIntent && (
          <p className="font-mono text-[10.5px] font-medium tracking-widest text-success uppercase">
            ✦ Gezet voor deze week
          </p>
        )}

        <IntentStillnessLink />
      </div>

      {/* ── Tip ── */}
      <p className="text-[13px] leading-relaxed text-fg-faint">
        Een goede intentie is klein, concreet en gaat over gedrag — niet over een uitkomst.
        &quot;Ik check mijn potten elke zondag&quot; werkt beter dan &quot;Ik ben financieel bewuster.&quot;
      </p>
    </PageContent>
  );
}
