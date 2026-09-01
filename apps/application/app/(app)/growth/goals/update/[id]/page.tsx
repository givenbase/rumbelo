import { GoalUpdatePage } from '../../_components/goal-pages';

export const metadata = { title: 'Edit goal' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-lg animate-rise px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-semibold text-fg">Edit goal</h1>
      <GoalUpdatePage id={id} />
    </div>
  );
}
