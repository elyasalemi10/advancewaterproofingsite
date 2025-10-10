import { Phone, Mail, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const services = [
    { label: 'Advance RapidSeal™ Balcony Waterproofing', path: '/services/rapidseal' },
    { label: 'Caulking Solutions', path: '/services/caulking-solutions' },
    { label: 'Balcony Leak Detection & Reporting', path: '/services/balcony-leak-detection' },
    { label: 'Bathroom & Shower Waterproofing', path: '/services/bathroom-shower-waterproofing' },
    { label: 'Planter Box Waterproofing', path: '/services/planter-box-waterproofing' },
    { label: 'Roof Deck & Podium Waterproofing', path: '/services/roof-deck-podium-waterproofing' },
    { label: 'Expansion Joint Sealing', path: '/services/expansion-joint-sealing' },
    { label: 'Preventative Maintenance Plans', path: '/services/maintenance-plans' }
  ]

  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">
              Advance <span className="text-primary">Waterproofing</span>
            </h3>
            <p className="text-white/70 mb-6">
              Melbourne's expert waterproofing contractors & remediation experts. Solving challenging water leaks permanently.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/70 hover:text-primary transition-colors">Home</Link></li>
              <li><a href="/#services" className="text-white/70 hover:text-primary transition-colors">Services</a></li>
              <li><a href="/#projects" className="text-white/70 hover:text-primary transition-colors">Projects</a></li>
              <li><a href="/#testimonials" className="text-white/70 hover:text-primary transition-colors">Testimonials</a></li>
              <li><a href="/#contact" className="text-white/70 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.path}><Link to={s.path} className="text-white/70 hover:text-primary transition-colors">{s.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a href="tel:+61390017788" className="text-white/70 hover:text-primary transition-colors">03 9001 7788</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a href="mailto:info@advancewaterproofing.com.au" className="text-white/70 hover:text-primary transition-colors break-words">info@advancewaterproofing.com.au</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/70">Melbourne Metro<br />Victoria, Australia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">© {currentYear} Advance Waterproofing and Caulking Solution. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
          <p className="text-white/40 text-xs text-center mt-4">VBA Registered Building Practitioner | Certified Waterproofers | Fully Insured</p>
        </div>
      </div>
    </footer>
  )
}
