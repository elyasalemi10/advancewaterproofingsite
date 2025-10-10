import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center pt-32 pb-20 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90"
      style={{
        backgroundImage: `linear-gradient(rgba(13, 59, 102, 0.55), rgba(13, 59, 102, 0.55)), url('https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FdWabIcrKixSdwUX9S0tZ3qjwI0M2%2FIMG_6736__fffd4b31.JPG?alt=media&token=cc887ebf-3ce4-4f83-ab49-cc3e6d0fc1f8')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Melbourne's Leading<br />
            <span className="text-accent">Waterproofing Company</span>
          </h2>
          <p className="text-xl sm:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
            Solving water leaks. Permanently.
          </p>
          <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
            Expert Waterproofing & Caulking Solutions | Specialised Waterproofing & Structural Remediation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => scrollToSection('contact')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 text-lg group"
            >
              Get a Free Quote
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={() => scrollToSection('services')}
              size="lg"
              variant="outline"
              className="bg-white/10 border-white text-white hover:bg-white hover:text-secondary px-8 text-lg backdrop-blur-sm"
            >
              Our Services
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-3xl font-bold text-primary mb-2">30+</h3>
            <p className="text-white/90">Years of Experience</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-3xl font-bold text-primary mb-2">VBA</h3>
            <p className="text-white/90">Registered Building Practitioner</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-3xl font-bold text-primary mb-2">100%</h3>
            <p className="text-white/90">Satisfaction Guaranteed</p>
          </div>
        </div>
      </div>
    </section>
  )
}
