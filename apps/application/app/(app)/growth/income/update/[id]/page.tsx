import { IncomeUpdatePage } from '../../_components/income-pages';

export const metadata = { title: 'Edit income' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-lg animate-rise px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-semibold text-fg">Edit income</h1>
      <IncomeUpdatePage id={id} />
    </div>
  );
}
