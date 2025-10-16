import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, Phone, Mail, User, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'
import { isWithinWorkingHours } from '@/lib/calcom'

// Working hours: 7 AM - 6 PM (last job at 5 PM for 1 hour)
const timeSlots = [
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
]

const services = [
  'Advance RapidSeal™ Balcony Waterproofing',
  'Caulking Solutions',
  'Leak Detection & Reporting',
  'Bathroom & Shower Waterproofing',
  'Planter Box Waterproofing',
  'Roof Deck & Podium Waterproofing',
  'Expansion Joint Sealing',
  'Preventative Maintenance Plans',
]

export function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time')
      return
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.service) {
      toast.error('Please fill in all required fields')
      return
    }

    // Parse selected time and create ISO string
    const [time, period] = selectedTime.split(' ')
    let [hours, minutes] = time.split(':').map(Number)
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    
    // Create start time with proper timezone
    const startDateTime = new Date(selectedDate)
    startDateTime.setHours(hours, minutes || 0, 0, 0)
    const startTimeISO = startDateTime.toISOString()
    
    const isInspection = true
    const endTimeISO = '' // no end-time usage in emails/UI
    
    // Validate working hours
    if (!isWithinWorkingHours(startTimeISO)) {
      toast.error('Please select a time within working hours (Mon-Fri, 7 AM - 6 PM)')
      return
    }

    setIsSubmitting(true)

    try {
      // Send email via serverless function
      const response = await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          service: formData.service,
          date: selectedDate.toISOString(),
          time: selectedTime,
          notes: formData.notes,
          isInspection: isInspection,
          startTime: startTimeISO,
          endTime: endTimeISO,
        })
      })

      if (response.ok) {
        setIsSubmitted(true)
        
        // Reset form
        setSelectedDate(undefined)
        setSelectedTime('')
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          service: '',
          notes: '',
        })
      } else {
        let errorMessage = `HTTP ${response.status}`
        const contentType = response.headers.get('content-type') || ''
        try {
          if (contentType.includes('application/json')) {
            const errorData = await response.json()
            errorMessage = JSON.stringify(errorData)
          } else {
            const text = await response.text()
            errorMessage = text || errorMessage
          }
        } catch (parseErr) {
          // leave errorMessage as-is
        }
        console.error('API Error sending booking:', errorMessage)
        
        toast.error(
          'There was an issue sending your booking. Please call us directly at 03 9001 7788.',
          { duration: 6000 }
        )
      }
    } catch (error) {
      console.error('Booking submission error:', error)
      toast.error('There was an issue submitting your booking. Please try again or call us directly at 03 9001 7788.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // no end time display

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Book a Job
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Schedule a job. We'll contact you to confirm or reschedule at your convenience.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {isSubmitted ? (
          // Success state
          <div className="py-8 sm:py-12 text-center animate-in fade-in duration-500">
            <div className="mb-4 sm:mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4 sm:p-6 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-secondary mb-3 px-4">
              Thank You! 🎉
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Your request has been received successfully!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-blue-900 mb-2">
                <strong>What happens next?</strong>
              </p>
              <ul className="text-sm text-blue-800 space-y-2 text-left max-w-md mx-auto">
                <li>✓ We'll review your request within 2 hours</li>
                <li>✓ A waterproofing specialist will contact you within 24 hours</li>
                <li>✓ We'll confirm your preferred time or suggest alternatives</li>
                <li>✓ You'll receive all details via email</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Need immediate assistance? Call us at{' '}
              <a href="tel:+61390017788" className="text-primary font-semibold hover:underline">
                03 9001 7788
              </a>
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false)
              }}
              variant="outline"
              className="mt-4"
            >
              Submit Another Request
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-start">
            {/* Calendar */}
            <div className="w-full md:w-[320px] flex-none relative z-0 overflow-hidden">
              <Label className="mb-2 block">Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border w-full"
              />
              {selectedDate && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {selectedDate.toLocaleDateString('en-AU', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>

            {/* Time Slots & Form */}
            <div className="space-y-3 sm:space-y-4 relative z-0 md:min-w-0">

              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Clock className="h-4 w-4" />
                  Preferred Start Time *
                </Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots
                      .filter((time) => !time.includes('5:') || time.includes('5:00'))
                      .map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                
              </div>

              <div>
                <Label htmlFor="name" className="flex items-center gap-2 text-sm sm:text-base">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2 text-sm sm:text-base">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm sm:text-base">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address" className="flex items-center gap-2 text-sm sm:text-base">
                  <MapPin className="h-4 w-4" />
                  Property Address *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Suburb, State, Postcode"
                  required
                />
              </div>

              <div>
                <Label htmlFor="service" className="text-sm sm:text-base">Service Type *</Label>
                <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm sm:text-base">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Tell us about your waterproofing needs..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What happens next?</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Your booking is automatically scheduled in our calendar</li>
              <li>You'll receive an email confirmation within minutes</li>
              <li>Our team will review and confirm or suggest alternative times</li>
              <li>Our specialist will arrive at the scheduled time for your on-site job</li>
            </ol>
            {/* Working hours text removed per request */}
          </div>

          <Button type="submit" className="w-full text-sm sm:text-base" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Submitting...
              </>
            ) : (
              'Submit Booking Request'
            )}
          </Button>
        </form>
        )}
      </CardContent>
    </Card>
  )
}
