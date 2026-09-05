import Link from 'next/link';

import { BOOKS } from './learn-books';

export const metadata = { title: 'Learn' };

/**
 * WHAT I LEARN — book list format.
 * Design: Kluis Finance App.dc.html:1208-1234.
 */
export default function LearnPage() {
    return (
        <div className="grid max-w-4xl animate-rise gap-8">
            {/* Page header */}
            <div>
                <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                    ✦ WHAT I LEARN
                </span>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg lg:text-4xl">
                    {/* copy from design: learn.head field (personalised) */}
                    Distribution has a floor. Learning doesn't.
                </h1>
            </div>

            {/* Education jar note */}
            <div
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-accent/40 bg-accent-soft px-5 py-4"
                style={{ boxShadow: 'var(--shadow-glow)' }}>
                <p className="min-w-0 flex-1 basis-72 text-sm leading-relaxed text-pretty text-fg-secondary">
                    Your Education jar is where knowledge spending lives — books, courses, and tools
                    that raise your earning power pay themselves back into Financial Freedom.
                </p>
                <Link
                    href="/money/jars"
                    className="flex-none rounded-full border border-line-strong px-4 py-2.5 font-mono text-xs tracking-wide whitespace-nowrap text-fg-secondary uppercase transition-colors hover:border-accent-hover hover:text-accent">
                    View Education jar ›
                </Link>
            </div>

            {/* Book list */}
            <div className="grid gap-2.5">
                {BOOKS.map(b => (
                    <div
                        key={b.title}
                        className={`grid gap-1.5 rounded-2xl border ${b.edge} bg-surface p-5 shadow-md`}>
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                            <span className="flex min-w-0 flex-wrap items-baseline gap-2.5">
                                <span className="font-display text-xl font-semibold tracking-tight text-fg">
                                    {b.title}
                                </span>
                                <span className="font-mono text-xs text-fg-muted">{b.author}</span>
                            </span>
                            <span
                                className={`font-mono text-xs font-semibold tracking-widest whitespace-nowrap uppercase ${b.tagColor}`}>
                                {b.tag}
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-pretty text-fg-muted">
                            ◇ {b.use}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
