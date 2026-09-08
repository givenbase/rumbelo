import { formRoute } from '@/app/_lib/form-route-meta';
import { FormRoutePageShell } from '@/components/layout/form-route-page-shell';
import { FixedCostCreatePage } from '../_components/fixed-cost-pages';

export const metadata = { title: formRoute('fixedCreate').title };

export default function Page() {
    const meta = formRoute('fixedCreate');

    return (
        <FormRoutePageShell
            title={meta.title}
            description={meta.description}
            closeHref={meta.closeHref}
            width={meta.width}>
            <FixedCostCreatePage embedded />
        </FormRoutePageShell>
    );
}
