import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, Phone, Mail, User, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import toast from 'react-hot-toast'
import { calculateEndTime, isWithinWorkingHours } from '@/lib/calcom'

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
  'Balcony Leak Detection & Reporting',
  'Bathroom & Shower Waterproofing',
  'Planter Box Waterproofing',
  'Roof Deck & Podium Waterproofing',
  'Expansion Joint Sealing',
  'Preventative Maintenance Plans',
]

export function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState('')
  const [bookingType, setBookingType] = useState<'inspection' | 'quote'>('inspection') // 'inspection' = job
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
    
    // Calculate end time based on booking type
    const isInspection = bookingType === 'inspection'
    const endTimeISO = calculateEndTime(startTimeISO, isInspection)
    
    // Validate working hours
    if (!isWithinWorkingHours(startTimeISO) || !isWithinWorkingHours(endTimeISO)) {
      toast.error('Please select a time within working hours (Mon-Fri, 7 AM - 6 PM)')
      return
    }

    // Show loading toast
    const loadingToast = toast.loading('Creating your booking...')

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

      toast.dismiss(loadingToast)

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.', { duration: 5000 })

        // Reset form
        setSelectedDate(undefined)
        setSelectedTime('')
        setBookingType('inspection')
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          service: '',
          notes: '',
        })
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        
        toast.error(
          'There was an issue sending your booking. Please call us directly at 03 9001 7788.',
          { duration: 6000 }
        )
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error('Booking submission error:', error)
      toast.error('There was an issue submitting your booking. Please try again or call us directly at 03 9001 7788.')
    }
  }

  const getEndTime = () => {
    if (!selectedTime) return ''
    const [time, period] = selectedTime.split(' ')
    let [hours, minutes] = time.split(':').map(Number)
    
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    
    const duration = bookingType === 'inspection' ? 60 : 10
    const totalMinutes = hours * 60 + (minutes || 0) + duration
    const endHours = Math.floor(totalMinutes / 60) % 24
    const endMinutes = totalMinutes % 60
    
    const endPeriod = endHours >= 12 ? 'PM' : 'AM'
    const displayHours = endHours > 12 ? endHours - 12 : endHours === 0 ? 12 : endHours
    
    return `${displayHours}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}`
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          {bookingType === 'inspection' ? 'Book a Free Job' : 'Request a Quote'}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Schedule a {bookingType === 'inspection' ? 'free on-site job' : 'quote call'}. We'll contact you to confirm or reschedule at your convenience.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Calendar */}
            <div>
              <Label className="mb-2 block">Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border"
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
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Timer className="h-4 w-4" />
                  Booking Type *
                </Label>
                <RadioGroup value={bookingType} onValueChange={(value: any) => setBookingType(value)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50">
                    <RadioGroupItem value="inspection" id="inspection" />
                    <Label htmlFor="inspection" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Free Job</div>
                      <div className="text-xs text-muted-foreground">On-site visit</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50">
                    <RadioGroupItem value="quote" id="quote" />
                    <Label htmlFor="quote" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Quote Call</div>
                      <div className="text-xs text-muted-foreground">Phone consultation</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

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
                      .filter(time => {
                        // For jobs, don't allow times after 5 PM (ends at 6 PM)
                        if (bookingType === 'inspection') {
                          return !time.includes('5:') || time.includes('5:00')
                        }
                        return true
                      })
                      .map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                {selectedTime && (
                  <p className="text-xs text-muted-foreground mt-1">
                    End time: {getEndTime()}
                  </p>
                )}
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
              <li>{bookingType === 'inspection' 
                ? 'Our specialist will arrive at the scheduled time for your free on-site job'
                : 'We\'ll call you at the scheduled time for a quote discussion'}
              </li>
            </ol>
            <p className="text-xs text-muted-foreground mt-3">
              📅 Working hours: Monday - Friday, 7:00 AM - 6:00 PM
            </p>
          </div>

          <Button type="submit" className="w-full text-sm sm:text-base" size="lg">
            Submit Booking Request
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
