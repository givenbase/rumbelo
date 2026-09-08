import { formRoute } from '@/app/_lib/form-route-meta';
import { FormRoutePageShell } from '@/components/layout/form-route-page-shell';
import { DebtUpdatePage } from '../../_components/debt-pages';

export const metadata = { title: formRoute('debtUpdate').title };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const meta = formRoute('debtUpdate');

    return (
        <FormRoutePageShell
            title={meta.title}
            description={meta.description}
            closeHref={meta.closeHref}
            width={meta.width}>
            <DebtUpdatePage id={id} embedded />
        </FormRoutePageShell>
    );
}
