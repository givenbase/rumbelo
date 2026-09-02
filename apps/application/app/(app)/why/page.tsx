import { Card, Eyebrow, Section } from '@rumbelo/ui';

import { PageContent } from '@/components/layout/page-content';

export const metadata = { title: 'Why Rumbelo' };

const PRINCIPLES = [
    {
        num: '1',
        title: '1 · DISTRIBUTE FIRST, SPEND SECOND',
        body: 'Six jars, filled the moment income arrives. Money that already has a job does not need to be defended a hundred times a month. This is the oldest wealth habit there is — pay your future first.',
    },
    {
        num: '2',
        title: '2 · TEN MINUTES A WEEK',
        body: 'Rumbelo does not ask for your evenings. One weekly check — look, aim, set intention — beats worrying every day. Control is a rhythm, not a mood.',
    },
    {
        num: '3',
        title: '3 · ENERGY CARRIES MONEY',
        body: 'Sleep, training, and nutrition are not lifestyle extras here. They are the floor beneath every financial decision you make. A tired mind spends; a rested mind steers.',
    },
    {
        num: '4',
        title: '4 · INFORMATION, NEVER SHAME',
        body: 'A jar over its line is a signal, not a judgement. Every overspend comes with the one move that fixes it. Those who feel judged stop; those who feel informed adjust.',
    },
];

export default function WhyFoundationPage() {
    return (
        <PageContent width="prose" className="animate-rise">
            <Section eyebrow="✦ The foundation">
                <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight text-fg md:text-5xl">
                    Your money should give you room to live — and room to grow.
                </h1>
                <p className="mt-4 max-w-prose text-base leading-relaxed text-fg-muted">
                    Rumbelo is for people who want control over their life with money: split with
                    intention, grow what matters, and keep a calm weekly rhythm. It is not a
                    bookkeeping app — it is one overview of money, energy, and time so you steer
                    before life steers you.
                </p>
            </Section>

            {/* Four principle cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {PRINCIPLES.map(p => (
                    <Card key={p.num} className="grid gap-2">
                        <Eyebrow>{p.title}</Eyebrow>
                        <p className="text-sm leading-relaxed text-fg-secondary">{p.body}</p>
                    </Card>
                ))}
            </div>

            {/* Closing quote */}
            <blockquote className="mt-10 font-display text-xl leading-relaxed font-medium tracking-tight text-fg-secondary italic md:text-2xl">
                &ldquo;Show me where your money and your hours go, and I will tell you where your
                life goes.&rdquo;
            </blockquote>
        </PageContent>
    );
}
