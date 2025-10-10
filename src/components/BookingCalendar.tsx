import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, Phone, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

const timeSlots = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
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

    // Show loading toast
    const loadingToast = toast.loading('Sending your booking request...')

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
        })
      })

      toast.dismiss(loadingToast)

      if (response.ok) {
        toast.success(
          `🎉 Booking request sent! We'll contact you at ${formData.email} to confirm your appointment on ${selectedDate.toLocaleDateString('en-AU')} at ${selectedTime}.`,
          { duration: 6000 }
        )

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

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          Book a Free Inspection
        </CardTitle>
        <CardDescription>
          Schedule a tentative appointment. We'll contact you to confirm or reschedule at your convenience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
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
            <div className="space-y-4">
              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Preferred Time
                </Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
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
                <Label htmlFor="email" className="flex items-center gap-2">
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
                <Label htmlFor="phone" className="flex items-center gap-2">
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
                <Label htmlFor="address" className="flex items-center gap-2">
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
                <Label htmlFor="service">Service Type *</Label>
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
                <Label htmlFor="notes">Additional Notes</Label>
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
              <li>You'll receive an email confirmation of your tentative booking</li>
              <li>Our team will contact you within 24 hours to confirm or reschedule</li>
              <li>A second confirmation email will be sent once the appointment is confirmed</li>
              <li>Our specialist will arrive at the scheduled time for your free inspection</li>
            </ol>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Submit Booking Request
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
