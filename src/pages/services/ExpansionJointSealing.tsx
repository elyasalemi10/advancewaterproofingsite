import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Move, Building2, Waves, CheckCircle2, TrendingUp, Timer } from 'lucide-react'
import { setSEO } from '@/lib/seo'
import CTA from '@/components/CTA'
import { Card, CardContent } from '@/components/ui/card'

export default function ExpansionJointSealing() {
  useEffect(() => {
    setSEO({
      title: 'Expansion Joint Sealing | Durable Movement Joints',
      description: 'High‑performance joint sealing solutions to accommodate building movement and prevent leaks.',
    })
  }, [])

  const features = [
    { icon: Move, title: 'Accommodates Movement', desc: 'Flexible sealants designed to absorb thermal expansion, contraction and structural movement' },
    { icon: Waves, title: 'Weatherproof Seal', desc: 'Superior protection against water ingress, wind and environmental elements' },
    { icon: Timer, title: 'Long-Lasting Performance', desc: 'Premium sealants with extended service life, reducing maintenance frequency' },
    { icon: Building2, title: 'Multi-Substrate', desc: 'Compatible with concrete, metal, glass, masonry and composite materials' },
  ]

  const applications = [
    'Building façade expansion joints',
    'Structural movement joints',
    'Parking deck expansion joints',
    'Podium and roof deck joints',
    'Bridge and infrastructure joints',
    'Pre-cast panel connections',
  ]

  const benefits = [
    'Prevents water infiltration and leaks',
    'Accommodates thermal & structural movement',
    'Reduces maintenance costs over time',
    'Enhances building weatherproofing',
    'Protects against corrosion and deterioration',
    'Improves aesthetic appearance',
  ]

  return (
    <main className="pt-28">
      <section className="bg-gradient-to-br from-slate-50 to-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">Expansion Joint Sealing</h1>
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                Buildings naturally expand and contract with temperature changes and structural loads. Our high-performance expansion joint sealing systems accommodate this movement while maintaining a watertight, weatherproof seal.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-slate-200 text-slate-800 border border-slate-300 font-medium">Flexible Systems</span>
                <span className="px-4 py-2 rounded-full bg-slate-200 text-slate-800 border border-slate-300 font-medium">Weatherproof</span>
                <span className="px-4 py-2 rounded-full bg-slate-200 text-slate-800 border border-slate-300 font-medium">Long-Lasting</span>
              </div>
            </div>
            <div className="relative">
              <img
                src="/expansion-joint-building.webp"
                alt="Building expansion joint sealing on commercial structure"
                className="rounded-lg shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border-2 border-primary">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-bold text-lg">Movement Protection</div>
                    <div className="text-sm text-muted-foreground">Flexible & Durable</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Professional Joint Sealing Matters</h2>
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

      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/expansion-joint-work.webp"
                alt="Expansion joint detail on modern building"
                className="rounded-lg shadow-xl w-full h-[500px] object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Key Benefits</h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-slate-50 border-l-4 border-primary rounded-r-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-secondary">Expert Selection:</strong> We specify the right sealant type and joint design for your project's movement requirements, substrate materials, and exposure conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Process</h2>
              <div className="space-y-4">
                {[
                  'Joint assessment & movement calculation',
                  'Removal of old sealant (if applicable)',
                  'Surface preparation & cleaning',
                  'Backing material installation',
                  'Primer application (where specified)',
                  'High-performance sealant application',
                  'Tooling & finishing for optimal performance',
                  'Quality inspection & cure monitoring',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {i + 1}
                    </div>
                    <span className="text-lg pt-1">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src="/expansion-joint-concrete.webp"
                alt="Professional sealant application process"
                className="rounded-lg shadow-xl w-full h-[600px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Common Applications</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {applications.map((app, i) => (
              <div key={i} className="bg-white p-5 rounded-lg border-2 border-primary/20 hover:border-primary transition-colors">
                <p className="font-medium text-center">{app}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center text-sm text-muted-foreground">
            Related services: <Link to="/services/caulking-solutions" className="text-primary underline font-medium">Caulking Solutions</Link> ·{' '}
            <Link to="/services/maintenance-plans" className="text-primary underline font-medium">Maintenance Plans</Link>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
