import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import CTA from '@/components/CTA'
import FAQ from '@/components/FAQ'
import { setSEO } from '@/lib/seo'
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider'
import { ProcessTimeline } from '@/components/ProcessTimeline'

export default function RapidSeal() {
  useEffect(() => {
    setSEO({
      title: 'Advance RapidSeal™ Balcony Waterproofing | Faster, Cheaper, Compliant',
      description:
        'RapidSeal™ is our proprietary balcony waterproofing system — 1/3 the time, 1/2 the cost, minimal disruption. AS 4654.2:2012 & AS 3740:2021 compliant. Warranty up to 15 years: subject to terms and conditions.',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'RapidSeal™ Balcony Waterproofing',
          provider: {
            '@type': 'LocalBusiness',
            name: 'Advance Waterproofing & Caulking Solution'
          },
          areaServed: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
          serviceType: 'Balcony waterproofing',
          url: 'https://www.advancewaterproofing.com.au/services/rapidseal'
        }
      ]
    })
  }, [])

  const steps = [
    { title: 'Inspection & moisture mapping', desc: 'Completed in ~1/3 the time of traditional rebuilds' },
    { title: 'Grinding & surface preparation', desc: 'Typically ~1/2 the cost of tile replacement' },
    { title: 'Detailing & crack repairs', desc: 'Minimal disruption – no jackhammers, reduced noise and dust' },
    { title: 'Primer application' },
    { title: 'Self‑levelling compound (where required)' },
    { title: 'First waterproof membrane', desc: 'Attractive, low‑maintenance finish ' },
    { title: 'Second waterproof membrane (Subjected to waterproofing method)', desc: 'Expert application for lasting protection. Warranty up to 15 years: subject to terms and conditions' },
    { title: 'Epoxy body coat or other Advance protective caoating (APC)', desc: 'Expert application for lasting protection' },
    { title: 'Decorative flake finish (optional)', desc: 'Expert application for lasting protection' },
    { title: 'UV‑stable clear sealer', desc: 'Expert application for lasting protection' },
  ]

  const benefits = [
    'Completed in ~1/3 the time of traditional rebuilds',
    'Typically ~1/2 the cost of tile replacement',
    'Minimal disruption – no jackhammers, reduced noise and dust',
    'Complies with AS 4654.2:2012, AS 3740:2021 and NCC',
    'Warranty up to 15 years: subject to terms and conditions',
    'Attractive, low‑maintenance finish'
  ]

  return (
    <main className="pt-28">
      <section className="bg-muted/50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">RapidSeal™ Balcony Waterproofing</h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-3xl">
            A proprietary, cost‑effective rectification method engineered to stop balcony leaks quickly and permanently — without full tile removal in most cases.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-accent/20 text-secondary border">Fast</span>
            <span className="px-3 py-1 rounded-full bg-accent/20 text-secondary border">Cost‑effective</span>
            <span className="px-3 py-1 rounded-full bg-accent/20 text-secondary border">Compliant</span>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">See the RapidSeal™ Difference</h2>
          <BeforeAfterSlider
            beforeImage="/before-rapid-seal.jpeg"
            afterImage="/after-rapid-seal.jpeg"
            beforeAlt="Damaged balcony before waterproofing"
            afterAlt="Restored balcony after RapidSeal treatment"
          />
          <p className="text-center text-muted-foreground mt-4 text-sm">
            Drag the slider to compare before and after RapidSeal™ application
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our 10‑Step RapidSeal™️ Process</h2>
          <div className="max-w-3xl mx-auto">
            <ProcessTimeline
              steps={steps.map(s => ({ title: s.title, description: s.desc }))}
            />
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 bg-background p-4 rounded-lg border">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Related services: <Link to="/services/caulking-solutions" className="text-primary underline">Caulking Solutions</Link> ·{' '}
            <Link to="/services/balcony-leak-detection" className="text-primary underline">Leak Detection & Reporting</Link>
          </div>
        </div>
      </section>

      <FAQ />
      <CTA />
    </main>
  )
}
