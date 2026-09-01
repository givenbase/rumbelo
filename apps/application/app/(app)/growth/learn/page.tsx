import Link from 'next/link';

import { formatMoney } from '@rumbelo/utils';

import { mockJars } from '@/app/_mock';

export const metadata = { title: 'Learn' };

const EDU_JAR = mockJars.find((j) => j.key === 'EDUCATION')!;

const BOOKS = [
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    tag: 'READ NOW',
    tagColor: 'text-accent',
    edge: 'border-accent/40',
    use: 'Behaviour changes slow progress faster than a better strategy. This book explains why good decisions look strange when you make them — and how to make them anyway.',
  },
  {
    title: 'Secrets of the Millionaire Mind',
    author: 'T. Harv Eker',
    tag: 'QUEUE',
    tagColor: 'text-fg-muted',
    edge: 'border-line',
    use: 'Subconscious beliefs about money determine what you do with it. This book names them so you can choose.',
  },
  {
    title: 'The Millionaire Fastlane',
    author: 'MJ DeMarco',
    tag: 'QUEUE',
    tagColor: 'text-fg-muted',
    edge: 'border-line',
    use: 'Saving your way to freedom via the slowlane works, but takes thirty years. This book shows a faster route — and the cost that comes with it.',
  },
  {
    title: 'I Will Teach You to Be Rich',
    author: 'Ramit Sethi',
    tag: 'DONE',
    tagColor: 'text-success',
    edge: 'border-success/30',
    use: 'Concrete steps for automating saving and investing. Less thinking, more doing.',
  },
] as const;

/**
 * WHAT I LEARN — book list format.
 * Design: Kluis Finance App.dc.html:1208-1234.
 */
export default function LearnPage() {
  return (
    <div className="grid animate-rise gap-8" style={{ maxWidth: 960 }}>
      {/* Page header */}
      <div>
        <span className="font-mono text-xs font-medium tracking-widest uppercase text-accent">
          ✦ WHAT I LEARN
        </span>
        <h1 className="mt-2 font-display text-3xl lg:text-4xl font-semibold tracking-tight text-fg">
          {/* copy from design: learn.head field (personalised) */}
          Distribution has a floor. Learning doesn't.
        </h1>
      </div>

      {/* Education jar note */}
      <div
        className="flex flex-wrap items-center gap-4 rounded-2xl border border-accent/40 bg-accent-soft px-5 py-4"
        style={{ boxShadow: 'var(--shadow-glow)' }}
      >
        <p className="min-w-0 min-w-0 flex-1 basis-72 text-sm leading-relaxed text-pretty text-fg-secondary">
          Your Education jar stands at{' '}
          <strong className="text-fg">{formatMoney(EDU_JAR.remaining)}</strong> — that is{' '}
          {formatMoney(EDU_JAR.remaining)} to spend on knowledge. Knowledge that affects your income
          pays itself back into the Financial Freedom jar.
        </p>
        <Link
          href="/money/jars"
          className="flex-none whitespace-nowrap rounded-full border border-line-strong px-4 py-2.5 font-mono text-xs tracking-wide uppercase text-fg-secondary transition-colors hover:border-accent-hover hover:text-accent"
        >
          View Education jar ›
        </Link>
      </div>

      {/* Book list */}
      <div className="grid gap-2.5">
        {BOOKS.map((b) => (
          <div
            key={b.title}
            className={`grid gap-1.5 rounded-2xl border ${b.edge} bg-surface p-5 shadow-md`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="flex min-w-0 flex-wrap items-baseline gap-2.5">
                <span className="font-display text-xl font-semibold tracking-tight text-fg">
                  {b.title}
                </span>
                <span className="font-mono text-xs text-fg-muted">{b.author}</span>
              </span>
              <span
                className={`whitespace-nowrap font-mono text-xs font-semibold tracking-widest uppercase ${b.tagColor}`}
              >
                {b.tag}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-pretty text-fg-muted">◇ {b.use}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
