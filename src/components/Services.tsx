import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Hammer, Droplets, Search, Wrench, Leaf, Building2, Expand, ShieldCheck } from 'lucide-react'

export default function Services() {
  const services = [
    { icon: Droplets, title: 'Advance RapidSeal™ Balcony Waterproofing', desc: 'Proprietary, cost‑effective method – faster, cheaper and compliant.', path: '/services/rapidseal' },
    { icon: Wrench, title: 'Caulking Solutions', desc: 'Professional sealing for balconies, windows, façades and joints.', path: '/services/caulking-solutions' },
    { icon: Search, title: 'Leak Detection & Reporting', desc: 'Diagnostics, moisture mapping and practical repair scopes.', path: '/services/balcony-leak-detection' },
    { icon: ShieldCheck, title: 'Bathroom & Shower Waterproofing', desc: 'Compliant wet‑area systems that protect your home or business.', path: '/services/bathroom-shower-waterproofing' },
    { icon: Leaf, title: 'Planter Box Waterproofing', desc: 'Root‑resistant membranes and drainage for lasting performance.', path: '/services/planter-box-waterproofing' },
    { icon: Building2, title: 'Roof Deck & Podium Waterproofing', desc: 'Robust systems for exposed, trafficable surfaces.', path: '/services/roof-deck-podium-waterproofing' },
    { icon: Hammer, title: 'Preventative Maintenance Plans', desc: 'Proactive inspections and sealing programs.', path: '/services/maintenance-plans' }
  ]

  return (
    <section id="services" className="py-20 bg-background scroll-mt-48">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-secondary mb-4">Our <span className="text-primary">Services</span></h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Specialised waterproofing and remediation services across Australia</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <Card key={s.path} className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{s.title}</CardTitle>
                  <CardDescription className="text-base">{s.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={s.path} className="inline-flex items-center text-primary font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
