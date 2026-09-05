'use client';

import { useRouter } from 'next/navigation';

import { EmptyState, Section } from '@rumbelo/ui';

import { CREATE_HREF } from '@/app/_lib/create-routes';
import { ListToolbar } from '@/components/layout/list-toolbar';

export default function TrainPage() {
    const router = useRouter();

    return (
        <div className="grid animate-rise gap-6">
            <Section eyebrow="Training" title="Energy you invest, not euros you spend.">
                <p className="max-w-prose text-base text-fg-muted">
                    Training is the only investment that pays out in energy rather than euros — and
                    energy is what earns the euros.
                </p>
            </Section>

            <ListToolbar
                createLabel="+ Add session"
                onCreate={() => router.push(CREATE_HREF.session)}
            />

            <EmptyState
                icon="💪"
                title="Nog geen data"
                body="Nog geen sessies deze week. Voeg er een toe zodra training hier gekoppeld is — binnenkort."
            />
        </div>
    );
}
