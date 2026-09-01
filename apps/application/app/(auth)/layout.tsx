import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <Link href="/" className="mb-10 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-accent font-display text-sm font-semibold text-on-accent">
            R
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Rumbelo</span>
        </Link>
        <div className="w-full max-w-sm">{children}</div>
      </div>

      {/* The manifesto sits beside the form so the first impression is the idea,
          not the input fields. Hidden on small screens where it would push the
          form below the fold. */}
      <aside className="hidden flex-col justify-center bg-raised px-12 lg:flex">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fg-muted">
          ✦ Geld met intentie
        </p>
        <p className="mt-4 max-w-md font-display text-3xl font-semibold leading-tight tracking-tight text-fg">
          Rijkdom is geen getal. Het zijn de teugels in jouw handen.
        </p>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-fg-secondary">
          Zes potten, gevuld op het moment dat inkomen binnenkomt. Eén weektelling van tien
          minuten. Geen boekhouding — regie.
        </p>
      </aside>
    </div>
  );
}
