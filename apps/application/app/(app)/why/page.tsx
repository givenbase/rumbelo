import { Card, Eyebrow, Section } from '@rumbelo/ui';
import { PageContent } from '@/components/layout/page-content';

export const metadata = { title: 'Waarom Rumbelo' };

const PRINCIPLES = [
  {
    num: '1',
    title: '1 · EERST VERDELEN, DAN UITGEVEN',
    body: 'Zes potten, gevuld op het moment dat inkomen binnenkomt. Geld dat al een taak heeft, hoef je niet honderd keer per maand te verdedigen. Dit is de oudste rijkdomsgewoonte die er is — betaal eerst je toekomst.',
  },
  {
    num: '2',
    title: '2 · TIEN MINUTEN PER WEEK',
    body: 'Rumbelo vraagt je avonden niet. Eén weektelling — kijken, richten, intentie zetten — verslaat elke dag piekeren. Regie is een ritme, geen stemming.',
  },
  {
    num: '3',
    title: '3 · ENERGIE DRAAGT GELD',
    body: "Slaap, training en voeding zijn hier geen lifestyle-extra's. Ze zijn de vloer onder elke financiële beslissing die je neemt. Een moe hoofd geeft uit; een uitgerust hoofd stuurt.",
  },
  {
    num: '4',
    title: '4 · INFORMATIE, NOOIT SCHAAMTE',
    body: 'Een pot over zijn lijn is een signaal, geen oordeel. Bij elke overschrijding hoort de ene beweging die het herstelt. Wie zich veroordeeld voelt, stopt; wie zich geïnformeerd voelt, stuurt bij.',
  },
];

export default function WhyFoundationPage() {
  return (
    <PageContent width="prose" className="animate-rise">
      <Section eyebrow="✦ Het fundament">
        <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-fg md:text-5xl">
          Rijkdom is geen getal. Het zijn de teugels in jouw handen.
        </h1>
        <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-fg-muted">
          Rumbelo bestaat voor mensen die succesvol willen worden — en voor mensen die het zijn en
          dat willen blijven. Het is geen boekhoud-app. Het is één rustig overzicht van waar je
          geld, je energie en je tijd heengaan, zodat jij kunt bijsturen voordat het leven jou
          bijstuurt.
        </p>
      </Section>

      {/* Four principle cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <Card key={p.num} className="grid gap-2">
            <Eyebrow>{p.title}</Eyebrow>
            <p className="text-sm leading-relaxed text-fg-secondary">{p.body}</p>
          </Card>
        ))}
      </div>

      {/* Closing quote */}
      <blockquote className="mt-10 font-display text-xl font-medium italic leading-relaxed tracking-tight text-fg-secondary md:text-2xl">
        &ldquo;Laat me zien waar je geld en je uren heengaan, en ik vertel je waar je leven
        heengaat.&rdquo;
      </blockquote>
    </PageContent>
  );
}
