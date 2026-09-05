'use client';

import { useEffect, useRef, useState } from 'react';

import { DEMO_INCOME_DEFAULT, FLOATERS, JARS, PROOF, TICKER } from '../../lib/landing-content';
import { appSignUpUrl } from '@/lib/portal-urls';

function fmt(n: number) {
    return '€' + Number(n).toLocaleString('en-IE');
}

function ease(x: number) {
    const c = Math.min(1, Math.max(0, x));
    return 1 - Math.pow(1 - c, 3);
}

export function LandingHero() {
    const income = DEMO_INCOME_DEFAULT;
    const [landP, setLandP] = useState(1);
    const [splitP, setSplitP] = useState(1);
    const rafRef = useRef<number>(0);
    const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

    useEffect(() => {
        const loop = () => {
            const t0 = performance.now();
            const tick = (now: number) => {
                const t = (now - t0) / 1000;
                const lp = Math.round(ease(t / 1.1) * 60) / 60;
                const sp = Math.round(ease((t - 1.3) / 1.6) * 60) / 60;
                setLandP(lp);
                setSplitP(sp);
                if (t < 3.2) rafRef.current = requestAnimationFrame(tick);
            };
            rafRef.current = requestAnimationFrame(tick);
        };
        loop();
        timerRef.current = setInterval(() => {
            if (!document.hidden) loop();
        }, 8000);
        return () => {
            clearInterval(timerRef.current);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const demoIncome = fmt(Math.round(income * landP));
    const demoPct = Math.round(100 * splitP) + '%';
    const demoStage =
        splitP >= 1
            ? 'THIS MONTH · SPLIT AUTOMATICALLY'
            : landP >= 1
              ? 'SPLITTING ACROSS SIX JARS…'
              : 'INCOME LANDING…';

    return (
        <section className="relative overflow-hidden">
            <span
                className="pointer-events-none absolute inset-[-20%_-10%]"
                style={{
                    background: 'var(--gradient-page)',
                    animation: 'drift 16s ease-in-out infinite',
                }}
            />

            {/* Floating labels */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                {FLOATERS.map((fl, i) => (
                    <span
                        key={i}
                        data-float
                        className="absolute font-mono font-medium tracking-normal whitespace-nowrap opacity-0"
                        style={{
                            left: fl.left,
                            top: fl.top,
                            fontSize: fl.size,
                            color: fl.color,
                            ['--fl-o' as string]: fl.o,
                            animation: `floatUp ${fl.dur} linear ${fl.delay} infinite`,
                        }}>
                        {fl.text}
                    </span>
                ))}

                {/* Ticker */}
                <div
                    className="absolute inset-x-0 bottom-2.5 overflow-hidden"
                    style={{
                        maskImage:
                            'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
                    }}>
                    <div
                        data-ticker
                        className="inline-flex gap-10 pr-10 whitespace-nowrap"
                        style={{ animation: 'tickerX 46s linear infinite' }}>
                        {TICKER.map((tk, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-widest text-fg-faint opacity-55">
                                <span
                                    className="size-1 shrink-0 rounded-full"
                                    style={{ background: tk.dot }}
                                />
                                {tk.t}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-8 px-4 py-12 pb-10 lg:gap-16 lg:px-6 lg:py-24 lg:pb-16">
                {/* Left column */}
                <div
                    className="min-w-0 flex-1 basis-96"
                    style={{ animation: 'rise 520ms var(--ease-out) both' }}>
                    <span className="font-mono text-xs font-medium tracking-widest text-accent uppercase">
                        ✦ MONEY · GROWTH · ENERGY · SOUL
                    </span>
                    <h1 className="my-4 mb-4 max-w-xs font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                        You earn fine. So where does it go?
                    </h1>
                    <p className="mb-7 max-w-prose text-base leading-relaxed text-fg-muted lg:text-lg">
                        Rumbelo splits your income across six jars the second it lands — the ones
                        you must pay, the ones that grow, and the one you are allowed to enjoy.
                        Every euro gets a job before it arrives.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={appSignUpUrl()}
                            className="rounded-full px-6 py-4 font-mono text-xs font-semibold tracking-wide text-on-accent uppercase transition-all hover:brightness-105 active:scale-95"
                            style={{ background: 'var(--gradient-accent)' }}>
                            Start free — no card
                        </a>
                        <a
                            href="#how"
                            className="rounded-full border border-line-strong px-6 py-4 font-mono text-xs font-medium tracking-wide text-fg-secondary uppercase transition-colors hover:border-accent hover:text-accent">
                            See how it works
                        </a>
                    </div>

                    {/* Proof stats */}
                    <div className="mt-8 flex flex-wrap gap-5">
                        {PROOF.map(p => (
                            <span key={p.l} className="grid gap-0.5">
                                <span className="font-display text-2xl font-semibold tracking-tight">
                                    {p.n}
                                </span>
                                <span className="font-mono text-xs font-medium tracking-wide text-fg-faint uppercase">
                                    {p.l}
                                </span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Demo card */}
                <div
                    className="min-w-0 flex-1 basis-96 overflow-hidden rounded-2xl border border-line bg-surface"
                    style={{
                        boxShadow: 'var(--shadow-lg), inset 0 0 0 1px rgb(14 17 22 / 0.08)',
                        animation:
                            'rise 620ms var(--ease-out) both, floaty 7s ease-in-out 1.4s infinite',
                    }}>
                    <span className="block h-1" style={{ background: 'var(--gradient-accent)' }} />
                    <div className="p-5 lg:p-7">
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                            <span className="font-mono text-xs font-medium tracking-widest text-fg-faint uppercase">
                                {demoStage}
                            </span>
                            <span className="font-mono text-xs font-semibold text-accent">
                                {demoPct}
                            </span>
                        </div>
                        <div className="my-2.5 mb-1 font-display text-4xl font-semibold tracking-tight lg:text-5xl">
                            {demoIncome}
                        </div>
                        <div className="mb-5 text-sm text-fg-muted">
                            Salary €3,450 · Freelance €850
                        </div>

                        {/* Bar */}
                        <div className="mb-5 flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-sunken">
                            {JARS.map(j => (
                                <span
                                    key={j.key}
                                    className="transition-[width] duration-75"
                                    style={{ width: `${j.pct * splitP}%`, background: j.colorVar }}
                                />
                            ))}
                        </div>

                        {/* Jar rows */}
                        <div className="grid gap-2.5">
                            {JARS.map(j => (
                                <span
                                    key={j.key}
                                    className="grid items-center gap-2.5"
                                    style={{ gridTemplateColumns: '10px minmax(0,1fr) auto auto' }}>
                                    <span
                                        className="size-2 rounded-sm"
                                        style={{ background: j.colorVar }}
                                    />
                                    <span className="min-w-0 text-sm text-fg-strong">{j.name}</span>
                                    <span className="font-mono text-xs font-medium text-fg-faint">
                                        {j.pct}%
                                    </span>
                                    <span className="font-mono text-sm font-medium text-fg">
                                        {fmt(Math.round(((income * j.pct) / 100) * splitP))}
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
