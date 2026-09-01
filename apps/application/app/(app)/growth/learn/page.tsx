import Link from 'next/link';
import { formatMoney } from '@rumbelo/utils';
import { mockJars } from '@/app/_mock';

export const metadata = { title: 'Leren' };

const EDU_JAR = mockJars.find((j) => j.key === 'EDUCATION')!;

const BOOKS = [
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    tag: 'LEES NU',
    tagColor: 'text-accent',
    edge: 'border-accent/40',
    use: 'Gedrag verandert trage vooruitgang sneller dan een betere strategie. Dit boek legt uit waarom goede beslissingen er raar uitzien als je ze neemt — en hoe je ze toch neemt.',
  },
  {
    title: 'Secrets of the Millionaire Mind',
    author: 'T. Harv Eker',
    tag: 'WACHTRIJ',
    tagColor: 'text-fg-muted',
    edge: 'border-line',
    use: 'Onderbewuste overtuigingen over geld bepalen wat je ermee doet. Dit boek benoemt ze zodat je kunt kiezen.',
  },
  {
    title: 'The Millionaire Fastlane',
    author: 'MJ DeMarco',
    tag: 'WACHTRIJ',
    tagColor: 'text-fg-muted',
    edge: 'border-line',
    use: 'Sparen naar vrijheid via de slowlane werkt, maar duurt dertig jaar. Dit boek laat een snellere route zien — en de bijbehorende kosten.',
  },
  {
    title: 'I Will Teach You to Be Rich',
    author: 'Ramit Sethi',
    tag: 'KLAAR',
    tagColor: 'text-success',
    edge: 'border-success/30',
    use: 'Concrete instellingen voor automatisering van sparen en beleggen. Minder nadenken, meer uitvoeren.',
  },
] as const;

/**
 * WAT IK LEER — boeklijst-formaat.
 * Design: Kluis Finance App.dc.html:1208-1234.
 */
export default function LearnPage() {
  return (
    <div className="grid animate-rise gap-8" style={{ maxWidth: 960 }}>
      {/* Paginaheader */}
      <div>
        <span className="font-mono text-[12px] font-medium tracking-[0.16em] uppercase text-accent">
          ✦ WAT IK LEER
        </span>
        <h1 className="mt-2 font-display text-[clamp(26px,4vw,38px)] font-semibold tracking-tight text-fg">
          {/* copy from design: learn.head field (personalised) */}
          Verdelen heeft een bodem. Leren niet.
        </h1>
      </div>

      {/* Education-pot notitie */}
      <div
        className="flex flex-wrap items-center gap-4 rounded-2xl border border-accent/40 bg-accent-soft px-5 py-4"
        style={{ boxShadow: 'var(--shadow-glow)' }}
      >
        <p className="min-w-0 flex-[1_1_300px] text-[13.5px] leading-relaxed text-pretty text-fg-secondary">
          Je Education-pot staat op{' '}
          <strong className="text-fg">{formatMoney(EDU_JAR.remaining)}</strong> — dat is{' '}
          {formatMoney(EDU_JAR.remaining)} om aan kennis uit te geven. Kennis die je inkomen raakt
          betaalt zichzelf terug in de Financial Freedom-pot.
        </p>
        <Link
          href="/money/jars"
          className="flex-none whitespace-nowrap rounded-full border border-line-strong px-4 py-2.5 font-mono text-[10px] tracking-[0.13em] uppercase text-fg-secondary transition-colors hover:border-accent-hover hover:text-accent"
        >
          Bekijk Education-pot ›
        </Link>
      </div>

      {/* Boekenlijst */}
      <div className="grid gap-2.5">
        {BOOKS.map((b) => (
          <div
            key={b.title}
            className={`grid gap-1.5 rounded-2xl border ${b.edge} bg-surface p-5 shadow-md`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="flex min-w-0 flex-wrap items-baseline gap-2.5">
                <span className="font-display text-[19px] font-semibold tracking-tight text-fg">
                  {b.title}
                </span>
                <span className="font-mono text-[11px] text-fg-muted">{b.author}</span>
              </span>
              <span
                className={`whitespace-nowrap font-mono text-[9.5px] font-semibold tracking-[0.16em] uppercase ${b.tagColor}`}
              >
                {b.tag}
              </span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-pretty text-fg-muted">◇ {b.use}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
