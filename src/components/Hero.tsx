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
      className="relative min-h-screen flex items-center justify-center pt-32 sm:pt-32 pb-12 sm:pb-20 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90"
      style={{
        backgroundImage: `linear-gradient(rgba(13, 59, 102, 0.55), rgba(13, 59, 102, 0.55)), url('/hero-background.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            Seal it right<br />
            <span className="text-accent">Protect for life</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-3 sm:mb-4 max-w-3xl mx-auto px-4">
            Solving water leaks. Permanently.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-white/80 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Expert Waterproofing & Caulking Solutions | Specialised Waterproofing & Structural Remediation
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button 
              onClick={() => scrollToSection('contact')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 text-base sm:text-lg group w-full sm:w-auto"
            >
              Request a Quote
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={() => scrollToSection('services')}
              size="lg"
              variant="outline"
              className="bg-white/10 border-white text-white hover:bg-white hover:text-secondary px-6 sm:px-8 text-base sm:text-lg backdrop-blur-sm w-full sm:w-auto"
            >
              Our Services
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">30+</h3>
            <p className="text-sm sm:text-base text-white/90">Years of Experience</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">VBA</h3>
            <p className="text-sm sm:text-base text-white/90">Registered Building Practitioner</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">100%</h3>
            <p className="text-sm sm:text-base text-white/90">Satisfaction Guaranteed</p>
          </div>
        </div>
      </div>
    </section>
  )
}
