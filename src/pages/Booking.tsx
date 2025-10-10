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

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Why Book an Inspection?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Expert Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Our specialists will thoroughly inspect your property and identify any waterproofing issues.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Detailed Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive a comprehensive report outlining problems and recommended solutions.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Custom Quote</h3>
                  <p className="text-sm text-muted-foreground">
                    Get a tailored, no-obligation quote based on your specific needs.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Peace of Mind</h3>
                  <p className="text-sm text-muted-foreground">
                    Make informed decisions about protecting your valuable property investment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
