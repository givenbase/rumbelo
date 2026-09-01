import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="max-w-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fg-muted">
          ✦ 404
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg">
          Deze pagina bestaat niet
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          Misschien is hij verplaatst, misschien klopte de link niet.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
        >
          Terug naar je dashboard
        </Link>
      </div>
    </main>
  );
}
