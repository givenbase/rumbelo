import { SheetStubForm } from '@/components/features/forms/sheet-stub-form';

export const metadata = { title: 'Nieuwe training' };

export default function Page() {
  return (
    <div className="mx-auto max-w-lg animate-rise px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-semibold text-fg">Nieuwe training</h1>
      <SheetStubForm kind="session" mode="create" embedded={false} />
    </div>
  );
}
