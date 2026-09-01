import { ExpenseCreatePage } from '../_components/expense-pages';

export const metadata = { title: 'Nieuwe uitgave' };

export default function Page() {
  return (
    <div className="mx-auto max-w-lg animate-rise px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-semibold text-fg">Nieuwe uitgave</h1>
      <ExpenseCreatePage />
    </div>
  );
}
