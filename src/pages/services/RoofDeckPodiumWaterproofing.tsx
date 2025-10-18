import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Shield, Sun, CheckCircle2, Layers, Footprints } from 'lucide-react'
import { setSEO } from '@/lib/seo'
import CTA from '@/components/CTA'
import { Card, CardContent } from '@/components/ui/card'
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider'

export default function RoofDeckPodiumWaterproofing() {
  useEffect(() => {
    setSEO({
      title: 'Roof Deck & Podium Waterproofing | Liquid & Sheet Membranes',
      description: 'Waterproofing for exposed roof decks and podiums using robust membrane systems for longevity.',
    })
  }, [])

  const features = [
    { icon: Shield, title: 'Heavy-Duty Systems', desc: 'Robust membrane systems designed for high-traffic and exposed locations' },
    { icon: Sun, title: 'UV & Weather Resistant', desc: 'Superior resistance to UV radiation, temperature extremes and weathering' },
    { icon: Footprints, title: 'Trafficable Surfaces', desc: 'Systems suitable for pedestrian traffic, furniture and light vehicular loads' },
    { icon: Layers, title: 'Multi-Layer Protection', desc: 'Comprehensive waterproofing with protection layers and wear surfaces' },
  ]

  const applications = [
    'Rooftop decks & terraces',
    'Podium & plaza decks',
    'Car park decks',
    'Common area terraces',
    'Plant room roofs',
    'Elevated walkways',
  ]

  const benefits = [
    'Long-term leak prevention',
    'Trafficable and durable finishes',
    'Protection from weather extremes',
    'Accommodates structural movement',
    'Compatible with various finishes (tiles, pavers, coatings)',
    'Warranty up to 15 years*',
    'Minimal maintenance requirements',
    'Compliant with AS standards',
  ]

  return (
    <main className="pt-28">
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">Roof Deck & Podium Waterproofing</h1>
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                Exposed roof decks and podiums face the harshest conditions—constant UV exposure, temperature extremes, and foot traffic. Our engineered waterproofing systems deliver lasting protection for these critical building elements.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 font-medium">Heavy-Duty</span>
                <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 font-medium">Weather-Resistant</span>
                <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 font-medium">Trafficable</span>
              </div>
            </div>
            <div className="relative">
              <img
                src="/roof-deck-system.webp"
                alt="Modern roof deck with waterproofing system"
                className="rounded-lg shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border-2 border-primary">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-bold text-lg">Built to Last</div>
                    <div className="text-sm text-muted-foreground">Engineered Systems</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Our Systems Excel</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Project Transformation</h2>
          <div className="max-w-3xl mx-auto">
            <BeforeAfterSlider
              beforeImage="/rooftop-before.webp"
              afterImage="/rooftop-after.webp"
              beforeAlt="Deteriorated roof deck before waterproofing"
              afterAlt="Fully waterproofed modern roof deck ready for use"
            />
            <p className="text-center text-muted-foreground mt-6 text-sm">
              From deteriorated to durable—see the transformation of a commercial roof deck
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/roof-deck-project.webp"
                alt="Professional waterproofing installation on roof deck"
                className="rounded-lg shadow-xl w-full h-[500px] object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Comprehensive Benefits</h2>
              <div className="space-y-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-indigo-100 border-l-4 border-primary rounded-r-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-secondary">*Warranty Terms:</strong> Extended warranty periods available subject to system selection, application conditions, and maintenance program adherence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Installation Process</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[
                { step: '1. Site Assessment', desc: 'Structural inspection, substrate evaluation, and drainage assessment' },
                { step: '2. Surface Preparation', desc: 'Cleaning, repairs, priming and ensuring proper substrate conditions' },
                { step: '3. Detailing Work', desc: 'Critical areas including drains, penetrations, edges and junctions' },
                { step: '4. Membrane Application', desc: 'Professional installation of selected waterproofing system' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.step.replace(/^\d+\.\s/, '')}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {[
                { step: '5. Protection Layers', desc: 'Installation of protection board or drainage composite as required' },
                { step: '6. Finishing System', desc: 'Application of tiles, pavers, coating or other specified finishes' },
                { step: '7. Quality Testing', desc: 'Flood testing, visual inspection and documentation of completed works' },
                { step: '8. Handover & Warranty', desc: 'Comprehensive handover pack with maintenance guidelines and warranty documentation' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                    {i + 5}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.step.replace(/^\d+\.\s/, '')}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Ideal Applications</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {applications.map((app, i) => (
              <div key={i} className="bg-white p-5 rounded-lg border-2 border-primary/20 hover:border-primary transition-colors flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="font-medium">{app}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center text-sm text-muted-foreground">
            Related services: <Link to="/services/planter-box-waterproofing" className="text-primary underline font-medium">Planter Box Waterproofing</Link> ·{' '}
            <Link to="/services/expansion-joint-sealing" className="text-primary underline font-medium">Expansion Joint Sealing</Link>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
