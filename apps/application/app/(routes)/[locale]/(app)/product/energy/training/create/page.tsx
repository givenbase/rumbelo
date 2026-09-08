import { formRoute } from '@/app/_lib/form-route-meta';
import { SheetStubForm } from '@/components/features/forms/sheet-stub-form';
import { FormRoutePageShell } from '@/components/layout/form-route-page-shell';

export const metadata = { title: formRoute('sessionCreate').title };

export default function Page() {
    const meta = formRoute('sessionCreate');

    return (
        <FormRoutePageShell
            title={meta.title}
            description={meta.description}
            closeHref={meta.closeHref}
            width={meta.width}>
            <SheetStubForm kind="session" mode="create" embedded />
        </FormRoutePageShell>
    );
}
