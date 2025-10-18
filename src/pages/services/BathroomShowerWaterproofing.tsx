import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShowerHead, Shield, Wrench, CheckCircle2, Droplet, Home } from 'lucide-react'
import { setSEO } from '@/lib/seo'
import CTA from '@/components/CTA'
import { Card, CardContent } from '@/components/ui/card'
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider'

export default function BathroomShowerWaterproofing() {
  useEffect(() => {
    setSEO({
      title: 'Bathroom & Shower Waterproofing | AS 3740:2021 Compliant',
      description: 'Wet area waterproofing for bathrooms and showers with compliant systems and detailing.',
    })
  }, [])

  const features = [
    { icon: Shield, title: 'AS 3740:2021 Compliant', desc: 'All installations meet Australian Standard requirements for wet area waterproofing' },
    { icon: Droplet, title: 'Premium Membranes', desc: 'High-performance liquid and sheet membrane systems from trusted manufacturers' },
    { icon: Wrench, title: 'Expert Installation', desc: 'Qualified applicators with extensive experience in wet area detailing' },
    { icon: Home, title: 'Residential & Commercial', desc: 'Complete waterproofing solutions for homes, apartments, hotels and facilities' },
  ]

  const applications = [
    'Bathroom floors & walls',
    'Shower recesses',
    'Laundry rooms',
    'Toilet areas',
    'Commercial wet areas',
    'Pool changing rooms',
  ]

  const process = [
    'Surface preparation & substrate assessment',
    'Drainage & fall verification',
    'Corners, joints & penetration detailing',
    'Waterproof membrane application (2+ coats)',
    'Cure time & quality checks',
    'Tiling or finishing (optional)',
  ]

  return (
    <main className="pt-28">
      <section className="bg-gradient-to-br from-cyan-50 to-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">Bathroom & Shower Waterproofing</h1>
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                Protect your property from water damage with professional wet area waterproofing. Our compliant systems prevent leaks, mold and structural damage in bathrooms, showers and laundries.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 font-medium">AS 3740:2021</span>
                <span className="px-4 py-2 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 font-medium">15 Year Warranty*</span>
                <span className="px-4 py-2 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 font-medium">Licensed Applicators</span>
              </div>
            </div>
            <div className="relative">
              <img
                src="/bathroom-tile.webp"
                alt="Modern waterproofed bathroom shower"
                className="rounded-lg shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg border-2 border-primary">
                <div className="flex items-center gap-3">
                  <ShowerHead className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-bold text-lg">Leak-Free</div>
                    <div className="text-sm text-muted-foreground">Guaranteed Protection</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Wet Area Waterproofing?</h2>
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
          <h2 className="text-3xl font-bold text-center mb-12">Before & After Transformation</h2>
          <div className="max-w-3xl mx-auto">
            <BeforeAfterSlider
              beforeImage="/bathroom-before.webp"
              afterImage="/bathroom-after.webp"
              beforeAlt="Bathroom before waterproofing"
              afterAlt="Modern waterproofed bathroom ready for tiling"
            />
            <p className="text-center text-muted-foreground mt-6 text-sm">
              Professional waterproofing ensures long-lasting protection and peace of mind
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Waterproofing Process</h2>
              <div className="space-y-4">
                {process.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      {i + 1}
                    </div>
                    <span className="text-lg pt-1">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-cyan-50 border-l-4 border-primary rounded-r-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-secondary">Compliance Guaranteed:</strong> Every project is completed to AS 3740:2021 standards with proper detailing at junctions, corners, penetrations and drainage points.
                </p>
              </div>
            </div>
            <div>
              <img
                src="/bathroom-shower.webp"
                alt="Waterproofing membrane application in bathroom"
                className="rounded-lg shadow-xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Wet Areas We Waterproof</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {applications.map((app, i) => (
              <div key={i} className="bg-white p-5 rounded-lg border-2 border-primary/20 hover:border-primary transition-colors flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="font-medium">{app}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-8 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-sm text-muted-foreground">
            Related services: <Link to="/services/rapidseal" className="text-primary underline font-medium">Balcony Waterproofing</Link> ·{' '}
            <Link to="/services/balcony-leak-detection" className="text-primary underline font-medium">Leak Detection</Link>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
