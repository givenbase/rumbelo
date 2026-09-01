import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid min-h-dvh lg:grid-cols-2">
            <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
                <Link href="/" className="mb-10 flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-lg bg-accent font-display text-sm font-semibold text-on-accent">
                        R
                    </span>
                    <span className="font-display text-lg font-semibold tracking-tight">
                        Rumbelo
                    </span>
                </Link>
                <div className="w-full max-w-sm">{children}</div>
            </div>

            {/* The manifesto sits beside the form so the first impression is the idea,
          not the input fields. Hidden on small screens where it would push the
          form below the fold. */}
            <aside className="hidden flex-col justify-center bg-raised px-12 lg:flex">
                <p className="text-xs font-semibold tracking-widest text-fg-muted uppercase">
                    ✦ Money with intention
                </p>
                <p className="mt-4 max-w-md font-display text-3xl leading-tight font-semibold tracking-tight text-fg">
                    Wealth is not a number. It is the reins in your hands.
                </p>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-fg-secondary">
                    Six jars, filled the moment income arrives. One ten-minute weekly check-in. No
                    bookkeeping — direction.
                </p>
            </aside>
        </div>
    );
}
