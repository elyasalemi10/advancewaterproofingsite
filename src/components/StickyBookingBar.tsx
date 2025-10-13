import { useState, useEffect } from 'react'
import { Phone, Calendar, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

export function StickyBookingBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 400
      setIsVisible(scrolled && !isDismissed)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground shadow-2xl z-40 transition-transform duration-300',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div className="hidden sm:block flex-1">
            <p className="font-semibold text-sm md:text-base">Ready to protect your property?</p>
            <p className="text-xs opacity-90">
              Free inspections • up to 15 years: subject to terms and conditions • Expert service
            </p>
          </div>
          <div className="flex gap-1.5 sm:gap-2 flex-1 sm:flex-none">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4"
              onClick={() => (window.location.href = 'tel:+61390017788')}
            >
              <Phone className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Call Now</span>
              <span className="sm:hidden">Call</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4"
              onClick={() => {
                navigate('/booking')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span>Book</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
