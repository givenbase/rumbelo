import { SheetStubForm } from '@/components/features/forms/sheet-stub-form';

export const metadata = { title: 'Verplaatsen' };

export default function Page() {
  return (
    <div className="mx-auto max-w-lg animate-rise px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-semibold text-fg">Verplaatsen</h1>
      <SheetStubForm kind="move" mode="create" embedded={false} />
    </div>
  );
}
