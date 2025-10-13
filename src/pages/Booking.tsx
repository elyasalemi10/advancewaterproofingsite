import { useEffect } from 'react'
import { BookingCalendar } from '@/components/BookingCalendar'
import { setSEO } from '@/lib/seo'

export default function Booking() {
  useEffect(() => {
    setSEO({
      title: 'Book Free Inspection | Advance Waterproofing',
      description:
        'Schedule a free waterproofing inspection with our expert team. Tentative bookings available - we will contact you to confirm your appointment.',
    })
  }, [])

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Schedule Your Free Inspection
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Book a convenient time for our waterproofing specialists to visit your property. 
            No obligation, completely free.
          </p>
        </div>

        <BookingCalendar />
      </div>
    </div>
  )
}
