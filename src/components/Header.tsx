import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Phone, Mail, Clock, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface HeaderProps {
  isScrolled: boolean
}

const services = [
  { label: 'Advance RapidSeal™ Balcony Waterproofing', path: '/services/rapidseal' },
  { label: 'Caulking Solutions', path: '/services/caulking-solutions' },
  { label: 'Leak Detection & Reporting', path: '/services/balcony-leak-detection' },
  { label: 'Bathroom & Shower Waterproofing', path: '/services/bathroom-shower-waterproofing' },
  { label: 'Planter Box Waterproofing', path: '/services/planter-box-waterproofing' },
  { label: 'Roof Deck & Podium Waterproofing', path: '/services/roof-deck-podium-waterproofing' },
  { label: 'Expansion Joint Sealing', path: '/services/expansion-joint-sealing' },
  { label: 'Preventative Maintenance Plans', path: '/services/maintenance-plans' }
]

export default function Header({ isScrolled }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openServices, setOpenServices] = useState(false)
  const location = useLocation()
  
  // Check if current path is a service page
  const isServicePage = services.some(s => location.pathname === s.path)

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    )}>
      <div className="bg-secondary text-white py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
            <div className="flex items-center gap-4">
              <a href="tel:+61390017788" className="flex items-center gap-2 hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                <Phone className="w-4 h-4" />
                <span>03 9001 7788</span>
              </a>
              <a href="mailto:info@advancewaterproofing.com.au" className="hidden sm:flex items-center gap-2 hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                <Mail className="w-4 h-4" />
                <span>info@advancewaterproofing.com.au</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Mon–Fri 7:00am–6:00pm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              <img src="/logo.webp" alt="Advance Waterproofing logo" className="h-9 md:h-10 w-auto" />
              <span className="sr-only">Advance Waterproofing</span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <Link 
              to="/" 
              className={cn(
                "text-foreground hover:text-primary transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded",
                location.pathname === '/' && "text-primary"
              )}
            >
              Home
            </Link>
            <div className="relative">
              <button 
                onClick={() => setOpenServices((s) => !s)} 
                className={cn(
                  "flex items-center gap-1 text-foreground hover:text-primary font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded",
                  isServicePage && "text-primary"
                )}
              >
                Services <ChevronDown className="w-4 h-4" />
              </button>
              {openServices && (
                <div onMouseLeave={() => setOpenServices(false)} className="absolute left-0 mt-2 w-[360px] bg-white rounded-lg border shadow-lg p-2">
                  {services.map((s) => (
                    <Link 
                      key={s.path} 
                      to={s.path} 
                      className={cn(
                        "block px-3 py-2 rounded hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        location.pathname === s.path && "bg-primary/10 text-primary font-medium"
                      )}
                      onClick={() => setOpenServices(false)}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <a href="/#projects" className="text-foreground hover:text-primary transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Projects</a>
            <a href="/#videos" className="text-foreground hover:text-primary transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Videos</a>
            <a href="/#testimonials" className="text-foreground hover:text-primary transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Testimonials</a>
            <a href="/#contact" className="text-foreground hover:text-primary transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Contact</a>
          </nav>

          <div className="hidden lg:block">
            <Link to="/#contact">
              <Button className="bg-primary hover:bg-primary/90 text-white px-6">Get a Quote</Button>
            </Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t animate-fade-in overflow-y-auto max-h-[80vh]">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={cn(
                "block w-full text-left px-4 py-2 hover:bg-accent rounded-md transition-colors",
                location.pathname === '/' && "text-primary font-medium"
              )}
            >
              Home
            </Link>
            <details className={cn("px-4 py-2", isServicePage && "text-primary")} open={isServicePage}>
              <summary className={cn("cursor-pointer font-medium", isServicePage && "text-primary")}>Services</summary>
              <div className="mt-2 space-y-1">
                {services.map((s) => (
                  <Link 
                    key={s.path} 
                    to={s.path} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className={cn(
                      "block px-3 py-2 rounded hover:bg-accent",
                      location.pathname === s.path && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </details>
            <a href="/#projects" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left px-4 py-2 hover:bg-accent rounded-md transition-colors">Projects</a>
            <a href="/#videos" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left px-4 py-2 hover:bg-accent rounded-md transition-colors">Videos</a>
            <a href="/#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left px-4 py-2 hover:bg-accent rounded-md transition-colors">Testimonials</a>
            <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left px-4 py-2 hover:bg-accent rounded-md transition-colors">Contact</a>
            <Link to="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-4">Get a Quote</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
