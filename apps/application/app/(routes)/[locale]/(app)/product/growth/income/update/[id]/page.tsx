import { formRoute } from '@/app/_lib/form-route-meta';
import { FormRoutePageShell } from '@/components/layout/form-route-page-shell';
import { IncomeUpdatePage } from '../../_components/income-pages';

export const metadata = { title: formRoute('incomeUpdate').title };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const meta = formRoute('incomeUpdate');

    return (
        <FormRoutePageShell
            title={meta.title}
            description={meta.description}
            closeHref={meta.closeHref}
            width={meta.width}>
            <IncomeUpdatePage id={id} embedded />
        </FormRoutePageShell>
    );
}
