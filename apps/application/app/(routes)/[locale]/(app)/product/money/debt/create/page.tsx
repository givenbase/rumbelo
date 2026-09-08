import { formRoute } from '@/app/_lib/form-route-meta';
import { FormRoutePageShell } from '@/components/layout/form-route-page-shell';
import { DebtCreatePage } from '../_components/debt-pages';

export const metadata = { title: formRoute('debtCreate').title };

export default function Page() {
    const meta = formRoute('debtCreate');

    return (
        <FormRoutePageShell
            title={meta.title}
            description={meta.description}
            closeHref={meta.closeHref}
            width={meta.width}>
            <DebtCreatePage embedded />
        </FormRoutePageShell>
    );
}
