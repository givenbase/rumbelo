import { EmptyState, Section } from '@rumbelo/ui';

export const metadata = { title: 'Nutrition' };

export default function FoodPage() {
    return (
        <div className="grid animate-rise gap-6">
            <Section eyebrow="Nutrition" title="Two numbers are enough to start.">
                <p className="max-w-prose text-base text-fg-muted">
                    Enough protein to keep what you build, and enough total to fuel it — without
                    turning meals into bookkeeping.
                </p>
            </Section>

            <EmptyState
                icon="🥗"
                title="Nog geen data"
                body="Voeding volgen komt binnenkort. Binnenkort zie je hier eiwit en calorieën per dag."
            />
        </div>
    );
}
