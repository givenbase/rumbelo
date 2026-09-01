import { LandingThemeToggle } from './landing-theme-toggle';

export function LandingHeader() {
    return (
        <header
            className="sticky top-0 z-20 border-b border-line backdrop-blur-md"
            style={{ background: 'var(--color-chrome)' }}>
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 lg:gap-5 lg:px-6">
                <div className="flex min-w-0 items-baseline gap-2">
                    <span className="font-display text-xl font-bold tracking-tight">Rumbelo</span>
                    <span className="font-mono text-xs font-medium tracking-widest whitespace-nowrap text-fg-faint uppercase">
                        MONEY WITH INTENTION
                    </span>
                </div>

                <nav className="ml-auto flex items-center gap-5">
                    <a
                        href="#pillars"
                        className="text-sm text-fg-muted transition-colors hover:text-accent">
                        The portals
                    </a>
                    <a
                        href="#jars"
                        className="text-sm text-fg-muted transition-colors hover:text-accent">
                        The jars
                    </a>
                    <a
                        href="#how"
                        className="text-sm text-fg-muted transition-colors hover:text-accent">
                        How it works
                    </a>
                    <a
                        href="#pricing"
                        className="text-sm text-fg-muted transition-colors hover:text-accent">
                        Pricing
                    </a>
                </nav>

                <LandingThemeToggle />

                <a
                    href="#signup"
                    className="shrink-0 rounded-full px-5 py-2.5 font-mono text-xs font-semibold tracking-wide text-on-accent uppercase transition-all hover:brightness-105 active:scale-95"
                    style={{ background: 'var(--gradient-accent)' }}>
                    Start free
                </a>
            </div>
        </header>
    );
}
