import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

export default function FAQ() {
  const faqs = [
    { q: 'How much does balcony waterproofing cost?', a: 'Costs vary by size and condition. Our RapidSeal™ method is typically about half the cost of full tile replacement and is completed in a fraction of the time. We provide free inspections and a tailored proposal.' },
    { q: 'Do you remove tiles?', a: 'Not usually. RapidSeal™ is designed to avoid tile removal in most cases, minimising disruption while meeting AS 4654.2:2012 and AS 3740:2021 requirements.' },
    { q: 'How long does the work take?', a: 'Most balconies are completed within 1–3 days depending on size and preparation required. Our method is streamlined to reduce downtime for residents.' },
    { q: 'Is the work compliant?', a: 'Yes. All systems and detailing comply with AS 4654.2:2012, AS 3740:2021 and the NCC. Warranty up to 15 years: subject to terms and conditions.' },
    { q: 'Do you provide caulking services?', a: 'Absolutely. We provide professional caulking to balconies, façades, windows, expansion joints and wet areas using high‑grade sealants for performance and appearance.' },
  ]

  return (
    <section id="faq" className="py-20 bg-muted/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-secondary">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-4 text-lg">Straightforward answers to common questions</p>
        </div>
        <Accordion type="single" collapsible className="bg-card rounded-lg border shadow-sm">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="px-6">
              <AccordionTrigger className="py-6 text-left hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a }
          }))
        }) }} />
      </div>
    </section>
  )
}
