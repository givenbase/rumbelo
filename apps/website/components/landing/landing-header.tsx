import { LandingThemeToggle } from './landing-theme-toggle';

export function LandingHeader() {
  return (
    <header
      className="sticky top-0 z-20 border-b border-line backdrop-blur-[14px]"
      style={{ background: 'var(--color-chrome)' }}
    >
      <div className="mx-auto flex max-w-[1180px] items-center gap-[clamp(12px,2vw,22px)] px-[clamp(14px,3vw,22px)] py-[13px]">
        <div className="flex min-w-0 items-baseline gap-[9px]">
          <span className="font-display text-[21px] font-bold tracking-tight">Rumbelo</span>
          <span className="font-mono text-[8.5px] font-medium tracking-[0.2em] whitespace-nowrap text-fg-faint uppercase">
            MONEY WITH INTENTION
          </span>
        </div>

        <nav className="ml-auto flex items-center gap-5">
          <a href="#pillars" className="text-[13.5px] text-fg-muted transition-colors hover:text-accent">
            The portals
          </a>
          <a href="#jars" className="text-[13.5px] text-fg-muted transition-colors hover:text-accent">
            The jars
          </a>
          <a href="#how" className="text-[13.5px] text-fg-muted transition-colors hover:text-accent">
            How it works
          </a>
          <a href="#pricing" className="text-[13.5px] text-fg-muted transition-colors hover:text-accent">
            Pricing
          </a>
        </nav>

        <LandingThemeToggle />

        <a
          href="#signup"
          className="font-mono shrink-0 rounded-full px-5 py-[11px] text-[10.5px] font-semibold uppercase tracking-[0.12em] text-on-accent transition-[filter] hover:brightness-105 active:scale-[0.985]"
          style={{ background: 'var(--gradient-accent)' }}
        >
          Start free
        </a>
      </div>
    </header>
  );
}
