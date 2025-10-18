import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import CTA from '@/components/CTA'
import { setSEO } from '@/lib/seo'

export default function CaulkingSolutions() {
  useEffect(() => {
    setSEO({
      title: 'Professional Caulking Solutions | Balconies, Windows, Façades & Joints',
      description:
        'High‑performance caulking for balconies, windows, façades and expansion joints. Prevent water ingress, improve durability, appearance and energy efficiency.',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Caulking Services',
        serviceType: 'Building sealing and joint sealing',
        areaServed: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
        url: 'https://www.advancewaterproofing.com.au/services/caulking-solutions'
      }
    })
  }, [])

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    {
      image: '/maintenance-professional.webp',
      alt: 'Professional caulking application'
    },
    {
      image: '/caulking-slide1.webp',
      alt: 'Window frame sealing'
    },
    {
      image: '/caulking-slide2.webp',
      alt: 'Building facade joint sealing'
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const applications = [
    'Balconies & terraces', 
    'Windows & door frames', 
    'Façades & cladding interfaces', 
    'Expansion and control joints', 
    'Wet areas & perimeters',
    'Curtain wall systems',
    'Precast concrete panels',
    'Metal cladding joints'
  ]
  
  const benefits = [
    'Prevents water ingress and moisture damage',
    'Enhances structural durability and lifespan',
    'Improves building appearance and aesthetics',
    'Reduces air leakage for better energy efficiency',
    'Accommodates building movement',
    'UV and weather resistant formulations',
    'Compliant with Australian Standards',
    'Long-lasting protection (10-20 year lifespan)'
  ]
  
  const process = [
    'Site assessment and joint inspection',
    'Remove old, failed sealant',
    'Surface preparation & cleaning',
    'Apply backing rod (where required)',
    'Primer application (as specified)',
    'Professional sealant application',
    'Tooling & finishing for neat appearance',
    'Quality control inspection',
    'Documentation and warranty'
  ]

  const goneWrong = [
    {
      image: '/caulking-gone-wrong2.webp',
      title: 'Adhesion Failure',
      description: 'Poor surface preparation leads to sealant debonding, allowing water ingress and structural damage.'
    },
    {
      image: '/caulking-gone-wrong1.webp',
      title: 'Wrong Sealant Type',
      description: 'Improper joint sizing causes premature sealant failure, cracking, and loss of weatherproofing.'
    },
    {
      image: '/waterproofingwrong.jpeg',
      title: 'Sealent vs Caulking',
      description: 'Caulks are low-performance, low-flexibility materials for static, interior joints, while sealants are high-performance, elastomeric materials (like silicone and polyurethane) designed for dynamic, exterior joints subject to significant movement'
    }
  ]

  return (
    <main className="pt-28">
      <section className="bg-muted/50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">Caulking Solutions</h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-3xl">
            Expert sealing for weatherproof, durable and neat finishes across residential and commercial buildings.
          </p>
        </div>
      </section>

      {/* Slideshow Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative">
            <div className="aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].alt}
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Applications, Benefits, Process Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">Applications</h2>
            <ul className="space-y-3">
              {applications.map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">Benefits</h2>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">Our Process</h2>
            <ol className="space-y-3">
              {process.map((p, i) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm">{p}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Caulking Gone Wrong Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-4">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Warning</span>
            </div>
            <h2 className="text-3xl font-bold text-secondary mb-3">When Caulking Goes Wrong</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Poor workmanship and incorrect materials can lead to expensive failures. Here are common issues we fix:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {goneWrong.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-secondary mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-4">
              Don't let poor caulking compromise your building's integrity.
            </p>
            <div className="text-sm text-muted-foreground">
              Related services: <Link to="/services/rapidseal" className="text-primary underline hover:text-primary/80">RapidSeal™</Link> ·{' '}
              <Link to="/services/expansion-joint-sealing" className="text-primary underline hover:text-primary/80">Expansion Joint Sealing</Link> ·{' '}
              <Link to="/services/maintenance-plans" className="text-primary underline hover:text-primary/80">Maintenance Plans</Link>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  )
}
