import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sprout, Droplets, Shield, CheckCircle2, Leaf, Waves } from 'lucide-react'
import { setSEO } from '@/lib/seo'
import CTA from '@/components/CTA'
import { Card, CardContent } from '@/components/ui/card'

export default function PlanterBoxWaterproofing() {
  useEffect(() => {
    setSEO({
      title: 'Planter Box Waterproofing | Long‑Lasting, Root‑Resistant Systems',
      description: 'Durable planter box waterproofing with root‑resistant membranes and proper drainage design.',
    })
  }, [])

  const features = [
    { icon: Shield, title: 'Root-Resistant Membranes', desc: 'Specialised waterproofing systems that prevent root penetration and membrane damage' },
    { icon: Droplets, title: 'Proper Drainage Design', desc: 'Engineered drainage solutions to prevent water pooling and structural overload' },
    { icon: Waves, title: 'Multi-Layer Protection', desc: 'Comprehensive waterproofing with drainage layers, protection boards and membranes' },
    { icon: Leaf, title: 'Landscape Compatible', desc: 'Systems compatible with various soil types, plants and irrigation requirements' },
  ]

  const keyFeatures = [
    'Root-resistant waterproof membrane',
    'Drainage cell or aggregate layer',
    'Filter fabric to prevent clogging',
    'Proper falls to drainage outlets',
    'Protected drainage outlets',
    'Corner and edge detailing',
    'Overflow provision',
    'Substrate-to-structure interface sealing',
  ]

  const commonIssues = [
    { problem: 'Water Leaks Below Planter', solution: 'Failed or inadequate waterproofing membrane allowing water through to structure below' },
    { problem: 'Root Damage', solution: 'Standard membranes penetrated by aggressive plant roots causing leaks' },
    { problem: 'Poor Drainage', solution: 'Blocked or inadequate drainage causing waterlogging and excessive weight' },
    { problem: 'Structural Damage', solution: 'Water ingress causing concrete deterioration, steel corrosion or timber rot' },
  ]

  return (
    <main className="pt-28">
      <section className="bg-gradient-to-br from-lime-50 to-green-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">Planter Box Waterproofing</h1>
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                Protect your building structure from the unique challenges of rooftop gardens and planter boxes. Our specialised waterproofing systems combine root-resistant membranes with proper drainage design for long-lasting, leak-free performance.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-lime-100 text-lime-800 border border-lime-300 font-medium">Root-Resistant</span>
                <span className="px-4 py-2 rounded-full bg-lime-100 text-lime-800 border border-lime-300 font-medium">Durable</span>
                <span className="px-4 py-2 rounded-full bg-lime-100 text-lime-800 border border-lime-300 font-medium">Drainage Engineered</span>
              </div>
            </div>
            <div className="relative">
              <img
                src="/planterbox.jpeg"
                alt="Modern rooftop planter boxes with waterproofing"
                className="rounded-lg shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg border-2 border-primary">
                <div className="flex items-center gap-3">
                  <Sprout className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-bold text-lg">Green & Protected</div>
                    <div className="text-sm text-muted-foreground">Leak-Free Gardens</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Specialised Waterproofing Features</h2>
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
              <h2 className="text-3xl font-bold mb-6">Complete System Components</h2>
              <div className="space-y-3">
                {keyFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-lime-50 border-l-4 border-primary rounded-r-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-secondary">Engineered Solutions:</strong> Every planter requires careful consideration of plant types, soil depth, irrigation, structural load capacity and drainage requirements.
                </p>
              </div>
            </div>
            <div>
              <img
                src="/planter-box-rooftop.webp"
                alt="Waterproofing installation in planter box"
                className="rounded-lg shadow-xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Common Planter Box Problems & Solutions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {commonIssues.map((issue, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-red-600 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    {issue.problem}
                  </h3>
                  <p className="text-muted-foreground">{issue.solution}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-green-50 to-lime-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src="/planter-box-landscape.webp"
                alt="Beautiful rooftop garden with proper waterproofing"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">Why Proper Waterproofing Matters</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Planter boxes present unique challenges that standard waterproofing can't handle:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                  <span>Constant moisture from soil and irrigation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                  <span>Aggressive plant roots seeking water sources</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                  <span>Heavy soil and water weight loads</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                  <span>Chemical exposure from fertilizers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                  <span>Difficult access for repairs once established</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ideal Applications</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {['Rooftop gardens', 'Balcony planters', 'Podium landscaping', 'Internal atriums', 'Green walls', 'Raised garden beds'].map((app, i) => (
              <div key={i} className="bg-muted/50 p-4 rounded-lg border-2 border-primary/20">
                <p className="font-medium">{app}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-sm text-muted-foreground">
            Related services: <Link to="/services/roof-deck-podium-waterproofing" className="text-primary underline font-medium">Roof & Podium Waterproofing</Link> ·{' '}
            <Link to="/services/balcony-leak-detection" className="text-primary underline font-medium">Leak Detection</Link>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
