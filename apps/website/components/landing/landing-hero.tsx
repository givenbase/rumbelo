'use client';

import { useEffect, useRef, useState } from 'react';
import { DEMO_INCOME_DEFAULT, FLOATERS, JARS, PROOF, TICKER } from '../../lib/landing-content';

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
        style={{ background: 'var(--gradient-page)', animation: 'drift 16s ease-in-out infinite' }}
      />

      {/* Floating labels */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {FLOATERS.map((fl, i) => (
          <span
            key={i}
            data-float
            className="absolute font-mono font-medium tracking-[0.06em] whitespace-nowrap opacity-0"
            style={{
              left: fl.left,
              top: fl.top,
              fontSize: fl.size,
              color: fl.color,
              ['--fl-o' as string]: fl.o,
              animation: `floatUp ${fl.dur} linear ${fl.delay} infinite`,
            }}
          >
            {fl.text}
          </span>
        ))}

        {/* Ticker */}
        <div
          className="absolute bottom-[10px] left-0 right-0 overflow-hidden"
          style={{ maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)' }}
        >
          <div
            data-ticker
            className="inline-flex gap-[42px] whitespace-nowrap pr-[42px]"
            style={{ animation: 'tickerX 46s linear infinite' }}
          >
            {TICKER.map((tk, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-[9px] font-mono text-[10px] font-medium tracking-[0.1em] text-fg-faint opacity-55"
              >
                <span
                  className="size-[5px] shrink-0 rounded-full"
                  style={{ background: tk.dot }}
                />
                {tk.t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative mx-auto flex max-w-[1180px] flex-wrap items-center gap-[clamp(32px,5vw,64px)] px-[clamp(14px,3vw,22px)] py-[clamp(48px,8vw,96px)] pb-[clamp(40px,6vw,72px)]">
        {/* Left column */}
        <div
          className="min-w-0 flex-[1_1_420px]"
          style={{ animation: 'rise 520ms var(--ease-out) both' }}
        >
          <span className="font-mono text-[10.5px] font-medium tracking-[0.2em] text-accent uppercase">
            ✦ MONEY · GROWTH · ENERGY · SOUL
          </span>
          <h1 className="my-4 mb-[18px] max-w-[18ch] font-display text-[clamp(36px,6vw,62px)] font-semibold leading-[1.04] tracking-tight">
            You earn fine. So where does it go?
          </h1>
          <p className="mb-7 max-w-[46ch] text-[clamp(16px,1.6vw,18.5px)] leading-relaxed text-fg-muted">
            Rumbelo splits your income across six jars the second it lands — the ones you must pay,
            the ones that grow, and the one you are allowed to enjoy. Every euro gets a job before it
            arrives.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#signup"
              className="font-mono rounded-full px-[26px] py-[15px] text-[11px] font-semibold uppercase tracking-[0.12em] text-on-accent transition-[filter] hover:brightness-105 active:scale-[0.985]"
              style={{ background: 'var(--gradient-accent)' }}
            >
              Start free — no card
            </a>
            <a
              href="#how"
              className="font-mono rounded-full border border-line-strong px-6 py-[15px] text-[11px] font-medium uppercase tracking-[0.12em] text-fg-secondary transition-colors hover:border-accent hover:text-accent"
            >
              See how it works
            </a>
          </div>

          {/* Proof stats */}
          <div className="mt-[30px] flex flex-wrap gap-5">
            {PROOF.map((p) => (
              <span key={p.l} className="grid gap-[3px]">
                <span className="font-display text-[22px] font-semibold tracking-tight">{p.n}</span>
                <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-fg-faint">
                  {p.l}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Demo card */}
        <div
          className="min-w-0 flex-[1_1_380px] overflow-hidden rounded-[22px] border border-line bg-surface"
          style={{
            boxShadow: 'var(--shadow-lg), inset 0 0 0 1px rgb(14 17 22 / 0.08)',
            animation: 'rise 620ms var(--ease-out) both, floaty 7s ease-in-out 1.4s infinite',
          }}
        >
          <span className="block h-[3px]" style={{ background: 'var(--gradient-accent)' }} />
          <div className="p-[clamp(20px,3vw,28px)]">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-fg-faint">
                {demoStage}
              </span>
              <span className="font-mono text-[10.5px] font-semibold text-accent">{demoPct}</span>
            </div>
            <div className="my-[10px] mb-1 font-display text-[clamp(32px,5vw,44px)] font-semibold tracking-tight">
              {demoIncome}
            </div>
            <div className="mb-5 text-[13px] text-fg-muted">Salary €3,450 · Freelance €850</div>

            {/* Bar */}
            <div className="mb-5 flex h-[10px] gap-[3px] overflow-hidden rounded-full bg-sunken">
              {JARS.map((j) => (
                <span
                  key={j.key}
                  className="transition-[width] duration-75"
                  style={{ width: `${j.pct * splitP}%`, background: j.colorVar }}
                />
              ))}
            </div>

            {/* Jar rows */}
            <div className="grid gap-[11px]">
              {JARS.map((j) => (
                <span
                  key={j.key}
                  className="grid items-center gap-[11px]"
                  style={{ gridTemplateColumns: '10px minmax(0,1fr) auto auto' }}
                >
                  <span
                    className="size-2 rounded-[2px]"
                    style={{ background: j.colorVar }}
                  />
                  <span className="min-w-0 text-[13.5px] text-fg-strong">{j.name}</span>
                  <span className="font-mono text-[10.5px] font-medium text-fg-faint">{j.pct}%</span>
                  <span className="font-mono text-[12.5px] font-medium text-fg">
                    {fmt(Math.round(income * j.pct / 100 * splitP))}
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
