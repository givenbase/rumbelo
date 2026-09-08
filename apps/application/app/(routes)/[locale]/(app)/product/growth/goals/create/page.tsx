import { formRoute } from '@/app/_lib/form-route-meta';
import { FormRoutePageShell } from '@/components/layout/form-route-page-shell';
import { GoalCreatePage } from '../_components/goal-pages';

export const metadata = { title: formRoute('goalCreate').title };

export default function Page() {
    const meta = formRoute('goalCreate');

    return (
        <FormRoutePageShell
            title={meta.title}
            description={meta.description}
            closeHref={meta.closeHref}
            width={meta.width}>
            <GoalCreatePage embedded />
        </FormRoutePageShell>
    );
}
