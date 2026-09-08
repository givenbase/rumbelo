import { formRoute } from '@/app/_lib/form-route-meta';
import { FormRoutePageShell } from '@/components/layout/form-route-page-shell';
import { FixedCostUpdatePage } from '../../_components/fixed-cost-pages';

export const metadata = { title: formRoute('fixedUpdate').title };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const meta = formRoute('fixedUpdate');

    return (
        <FormRoutePageShell
            title={meta.title}
            description={meta.description}
            closeHref={meta.closeHref}
            width={meta.width}>
            <FixedCostUpdatePage id={id} embedded />
        </FormRoutePageShell>
    );
}
