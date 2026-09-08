import { formRoute } from '@/app/_lib/form-route-meta';
import { FormRoutePageShell } from '@/components/layout/form-route-page-shell';
import { ExpenseUpdatePage } from '../../_components/expense-pages';

export const metadata = { title: formRoute('txUpdate').title };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const meta = formRoute('txUpdate');

    return (
        <FormRoutePageShell
            title={meta.title}
            description={meta.description}
            closeHref={meta.closeHref}
            width={meta.width}>
            <ExpenseUpdatePage id={id} embedded />
        </FormRoutePageShell>
    );
}
