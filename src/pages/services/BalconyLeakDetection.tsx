import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Camera, FileText, CheckCircle2, Droplets, AlertTriangle } from 'lucide-react'
import { setSEO } from '@/lib/seo'
import CTA from '@/components/CTA'
import { Card, CardContent } from '@/components/ui/card'

export default function BalconyLeakDetection() {
  useEffect(() => {
    setSEO({
      title: 'Balcony Leak Detection & Reporting | Thermal & Moisture Diagnostics',
      description: 'Comprehensive balcony leak detection with moisture mapping and clear reporting to identify causes and scope repairs.',
    })
  }, [])

  const methods = [
    { icon: Search, title: 'Visual Inspection', desc: 'Comprehensive assessment of balcony surfaces, drainage, joints and waterproofing details' },
    { icon: Droplets, title: 'Moisture Mapping', desc: 'Electronic moisture detection to identify water-affected areas beneath tiles and finishes' },
    { icon: Camera, title: 'Thermal Imaging', desc: 'Infrared technology to locate moisture pathways and hidden leaks non-invasively' },
    { icon: FileText, title: 'Detailed Reporting', desc: 'Clear documentation with photos, findings, root causes and practical repair recommendations' },
  ]

  const benefits = [
    'Accurate identification of leak sources',
    'Non-invasive moisture detection',
    'Detailed photographic evidence',
    'Clear repair scope and cost estimates',
    'Compliance with building standards',
    'Expert analysis and recommendations',
  ]

  return (
    <main className="pt-28">
      <section className="bg-gradient-to-br from-blue-50 to-muted/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">Balcony Leak Detection & Reporting</h1>
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                Don't guess where the water is coming from. Our diagnostic services use advanced moisture detection and thermal imaging to pinpoint the exact source of balcony leaks, saving you time and money on targeted repairs.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-800 border border-blue-300 font-medium">Thermal Imaging</span>
                <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-800 border border-blue-300 font-medium">Moisture Detection</span>
                <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-800 border border-blue-300 font-medium">Expert Analysis</span>
              </div>
            </div>
            <div className="relative">
              <img
                src="/balcony-leak-detected.jpeg"
                alt="Thermal imaging of balcony leak detection"
                className="rounded-lg shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border-2 border-primary">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-bold text-lg">Leak Source Found</div>
                    <div className="text-sm text-muted-foreground">Accurate diagnostics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Detection Methods</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {methods.map((method, i) => {
              const Icon = method.icon
              return (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{method.title}</h3>
                    <p className="text-sm text-muted-foreground">{method.desc}</p>
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
                src="/why-choose-us.jpeg"
                alt="Detailed leak detection report with moisture readings"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">Why Choose Our Detection Service?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-blue-50 border-l-4 border-primary rounded-r-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-secondary">Professional Reporting:</strong> Each inspection includes a comprehensive report with high-resolution photos, moisture readings, root cause analysis, and a detailed scope of works for rectification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-sm text-muted-foreground">
            Related services: <Link to="/services/rapidseal" className="text-primary underline font-medium">RapidSeal™ Repairs</Link> ·{' '}
            <Link to="/services/caulking-solutions" className="text-primary underline font-medium">Joint Sealing</Link>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
