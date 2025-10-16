import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import WhyChooseUs from '@/components/WhyChooseUs'
import Projects from '@/components/Projects'
import Videos from '@/components/Videos'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import CTA from '@/components/CTA'
import { setSEO } from '@/lib/seo'

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    setSEO({
      title: 'Advance Waterproofing & Caulking Solution | Balcony Waterproofing in Melbourne',
      description:
        'Commercial and residential waterproofing specialists. Balcony waterproofing, caulking, leak detection and remediation across Melbourne & Victoria. Free inspections.',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Advance Waterproofing & Caulking Solution',
        url: 'https://www.advancewaterproofing.com.au',
        telephone: '+61390017788',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Melbourne',
          addressRegion: 'VIC',
          addressCountry: 'AU'
        },
        areaServed: ['Melbourne', 'Victoria', 'Australia'],
        sameAs: []
      }
    })
  }, [])

  useEffect(() => {
    const offsetScroll = (el: HTMLElement) => {
      const y = el.getBoundingClientRect().top + window.scrollY
      const offset = 140 // account for opening hours bar + navbar height
      window.scrollTo({ top: Math.max(y - offset, 0), behavior: 'smooth' })
    }
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''))
      if (el) offsetScroll(el)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location])

  return (
    <div>
      <Hero />
      <Services />
      <WhyChooseUs />
      <Projects />
      <Videos />
      <Testimonials />
      <CTA />
      <Contact />
    </div>
  )
}
