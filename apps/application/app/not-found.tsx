import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="grid min-h-dvh place-items-center px-6 text-center">
            <div className="max-w-sm">
                <p className="text-xs font-semibold tracking-widest text-fg-muted uppercase">
                    ✦ 404
                </p>
                <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg">
                    This page does not exist
                </h1>
                <p className="mt-2 text-sm text-fg-muted">
                    It may have moved, or the link may be wrong.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover">
                    Back to your dashboard
                </Link>
            </div>
        </main>
    );
}
