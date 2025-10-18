import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ClipboardCheck, TrendingDown, Shield, CheckCircle2, Building } from 'lucide-react'
import { setSEO } from '@/lib/seo'
import CTA from '@/components/CTA'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MaintenancePlans() {
  useEffect(() => {
    setSEO({
      title: 'Preventative Maintenance Plans | Proactive Waterproofing Care',
      description: 'Scheduled inspections and sealing to prevent leaks before they start for strata and commercial assets.',
    })
  }, [])

  const benefits = [
    { icon: TrendingDown, title: 'Reduce Repair Costs', desc: 'Early detection prevents minor issues from becoming expensive emergency repairs' },
    { icon: Shield, title: 'Asset Protection', desc: 'Maintain property value and prevent structural damage from water ingress' },
    { icon: Calendar, title: 'Scheduled Service', desc: 'Regular inspections and maintenance on a convenient, predictable schedule' },
    { icon: ClipboardCheck, title: 'Compliance Records', desc: 'Documented maintenance history for strata, insurance and building regulations' },
  ]

  const planIncludes = [
    'Scheduled waterproofing inspections',
    'Joint sealant condition assessment',
    'Drainage system checks and clearing',
    'Minor sealant repairs and touch-ups',
    'Detailed reporting with photos',
    'Maintenance recommendations',
    'Priority service for urgent issues',
    'Discounted rates on major works',
  ]

  const idealFor = [
    { type: 'Strata & Body Corporate', desc: 'Multi-unit complexes with multiple balconies, common areas and wet zones' },
    { type: 'Commercial Buildings', desc: 'Office buildings, retail centres, and mixed-use developments' },
    { type: 'Industrial Facilities', desc: 'Warehouses, factories and production facilities with exposed structures' },
    { type: 'Property Managers', desc: 'Managing multiple properties requiring consistent maintenance oversight' },
    { type: 'Aged Care & Healthcare', desc: 'Facilities requiring reliable waterproofing and minimal disruption' },
    { type: 'Educational Institutions', desc: 'Schools and universities with extensive building portfolios' },
  ]

  return (
    <main className="pt-28">
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">Preventative Maintenance Plans</h1>
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                Don't wait for leaks to happen. Our proactive maintenance programs identify and address waterproofing issues before they become costly emergencies, protecting your investment and ensuring compliance.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 border border-green-300 font-medium">Proactive</span>
                <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 border border-green-300 font-medium">Cost-Effective</span>
                <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 border border-green-300 font-medium">Peace of Mind</span>
              </div>
            </div>
            <div className="relative">
              <img
                src="/maintenance-inspection.webp"
                alt="Building maintenance inspection checklist"
                className="rounded-lg shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border-2 border-primary">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-bold text-lg">Scheduled Care</div>
                    <div className="text-sm text-muted-foreground">Regular Inspections</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Preventative Maintenance?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon
              return (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
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
            <div className="order-2 md:order-1">
              <img
                src="/maintenance-professional.webp"
                alt="Professional building inspection and maintenance"
                className="rounded-lg shadow-xl w-full h-[500px] object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">What's Included in Our Plans</h2>
              <div className="space-y-3">
                {planIncludes.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-green-50 border-l-4 border-primary rounded-r-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-secondary">Flexible Plans:</strong> We tailor maintenance schedules to your property's needs - from quarterly inspections for high-rise complexes to annual check-ups for smaller properties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ideal For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {idealFor.map((item, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    {item.type}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">The Cost of Neglect</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-red-600 mb-2">$25,000+</div>
              <p className="text-sm text-muted-foreground">Average cost of emergency balcony leak repairs</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-orange-600 mb-2">3-6 weeks</div>
              <p className="text-sm text-muted-foreground">Typical disruption time for major rectification</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-green-600 mb-2">80%</div>
              <p className="text-sm text-muted-foreground">Savings with early detection and prevention</p>
            </div>
          </div>
          <p className="mt-10 text-lg text-muted-foreground max-w-2xl mx-auto">
            Regular maintenance isn't just about compliance—it's about protecting your asset value and avoiding the stress and cost of emergency repairs.
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Comprehensive Maintenance Coverage</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {['Balconies & terraces', 'Joint sealants', 'Drainage systems', 'Wet areas', 'Podiums & roof decks', 'Expansion joints'].map((area, i) => (
              <div key={i} className="bg-muted/50 p-4 rounded-lg border-2 border-primary/20">
                <p className="font-medium">{area}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-sm text-muted-foreground">
            Related services: <Link to="/services/balcony-leak-detection" className="text-primary underline font-medium">Leak Detection</Link> ·{' '}
            <Link to="/services/caulking-solutions" className="text-primary underline font-medium">Caulking & Sealing</Link>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
