import { formRoute } from '@/app/_lib/form-route-meta';
import { FormRoutePageShell } from '@/components/layout/form-route-page-shell';
import { GoalUpdatePage } from '../../_components/goal-pages';

export const metadata = { title: formRoute('goalUpdate').title };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const meta = formRoute('goalUpdate');

    return (
        <FormRoutePageShell
            title={meta.title}
            description={meta.description}
            closeHref={meta.closeHref}
            width={meta.width}>
            <GoalUpdatePage id={id} embedded />
        </FormRoutePageShell>
    );
}
