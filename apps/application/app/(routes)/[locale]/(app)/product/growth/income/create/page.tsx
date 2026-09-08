import { formRoute } from '@/app/_lib/form-route-meta';
import { FormRoutePageShell } from '@/components/layout/form-route-page-shell';
import { IncomeCreatePage } from '../_components/income-pages';

export const metadata = { title: formRoute('incomeCreate').title };

export default function Page() {
    const meta = formRoute('incomeCreate');

    return (
        <FormRoutePageShell
            title={meta.title}
            description={meta.description}
            closeHref={meta.closeHref}
            width={meta.width}>
            <IncomeCreatePage embedded />
        </FormRoutePageShell>
    );
}
