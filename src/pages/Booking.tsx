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
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        <BookingCalendar />
      </div>
    </div>
  )
}
