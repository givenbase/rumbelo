import { IncomeCreatePage } from '../_components/income-pages';

export const metadata = { title: 'New income' };

export default function Page() {
  return (
    <div className="mx-auto max-w-lg animate-rise px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-semibold text-fg">New income</h1>
      <IncomeCreatePage />
    </div>
  );
}
