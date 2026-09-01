import { FixedCostUpdatePage } from '../../_components/fixed-cost-pages';

export const metadata = { title: 'Vaste last bewerken' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-lg animate-rise px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-semibold text-fg">Vaste last bewerken</h1>
      <FixedCostUpdatePage id={id} />
    </div>
  );
}
