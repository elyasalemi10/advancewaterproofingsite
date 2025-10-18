import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, Phone, Mail, User, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// Working hours: 7 AM - 4 PM (last job at 4 PM for 1 hour)
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
]

const services = [
  'Advance RapidSeal™ Balcony Waterproofing',
  'Caulking Solutions',
  'Leak Detection & Reporting',
  'Bathroom & Shower Waterproofing',
  'Planter Box Waterproofing',
  'Roof Deck & Podium Waterproofing',
  'Preventative Maintenance Plans',
  'Other',
]

function formatLocalDateYYYYMMDD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function isWithinWorkingHours(datetime: string): boolean {
  const date = new Date(datetime)
  const day = date.getDay()
  const hour = date.getHours()
  if (day === 0 || day === 6) return false
  return hour >= 7 && hour < 16
}

export default function AdminCreateJob() {
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
    otherService: '',
    notes: '',
  })
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!selectedDate || !selectedTime) {
      setErrorMsg('Please select a date and time')
      return
    }
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.service) {
      setErrorMsg('Please fill in all required fields')
      return
    }
    if (formData.service === 'Other' && !formData.otherService.trim()) {
      setErrorMsg('Please describe what you are looking for')
      return
    }

    const [time, period] = selectedTime.split(' ')
    let [hours, minutes] = time.split(':').map(Number)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0

    const startDateTime = new Date(selectedDate)
    startDateTime.setHours(hours, minutes || 0, 0, 0)
    const startTimeISO = startDateTime.toISOString()

    const isInspection = true
    const endTimeISO = ''

    if (!isWithinWorkingHours(startTimeISO)) {
      setErrorMsg('Please select a time within working hours (Mon-Fri, 7 AM - 4 PM)')
      return
    }

    setIsSubmitting(true)
    try {
      const createResp = await fetch('/api/send-booking-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          service: formData.service === 'Other' ? `Other: ${formData.otherService.trim()}` : formData.service,
          date: formatLocalDateYYYYMMDD(selectedDate),
          time: selectedTime,
          notes: formData.notes,
          isInspection,
          startTime: startTimeISO,
          endTime: endTimeISO,
        })
      })
      const createData = await createResp.json()
      if (!createResp.ok) throw new Error(createData.error || 'Failed to create')

      const confirmResp = await fetch('/api/confirm-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('aw_auth') || ''}` },
        body: JSON.stringify({ bookingId: createData.bookingId })
      })
      const confirmData = await confirmResp.json()
      if (!confirmResp.ok) throw new Error(confirmData.error || 'Failed to confirm booking')

      setSuccessMsg('Job created and confirmed. Customer notified. ✅')
      setIsSubmitted(true)

      setSelectedDate(undefined)
      setSelectedTime('')
      setFormData({ name: '', email: '', phone: '', address: '', service: '', otherService: '', notes: '' })
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create job')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="pt-28">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Create Job (Admin)
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">Create and auto-confirm a job for a customer.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {isSubmitted ? (
              <div className="py-8 sm:py-12 text-center animate-in fade-in duration-500">
                <div className="mb-4 sm:mb-6 flex justify-center">
                  <div className="rounded-full bg-green-100 p-4 sm:p-6 animate-in zoom-in duration-500">
                    <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-secondary mb-3 px-4">Success</h3>
                <p className="text-lg text-muted-foreground mb-6">{successMsg || 'Job created and confirmed.'}</p>
                <Button variant="outline" onClick={() => { setIsSubmitted(false); setSuccessMsg('') }}>Create Another Job</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {errorMsg && <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800 text-sm">{errorMsg}</div>}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-start">
                  <div className="w-full md:w-[320px] flex-none relative z-0 overflow-hidden">
                    <Label className="mb-2 block">Select Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                      className="rounded-md border w-full"
                    />
                    {selectedDate && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected: {selectedDate.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 sm:space-y-4 relative z-0 md:min-w-0">
                    <div>
                      <Label className="mb-2 flex items-center gap-2 text-sm sm:text-base"><Clock className="h-4 w-4" />Preferred Start Time *</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2 text-sm sm:text-base"><User className="h-4 w-4" />Full Name *</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2 text-sm sm:text-base"><Mail className="h-4 w-4" />Email Address *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2 text-sm sm:text-base"><Phone className="h-4 w-4" />Phone Number *</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                    </div>

                    <div>
                      <Label htmlFor="address" className="flex items-center gap-2 text-sm sm:text-base"><MapPin className="h-4 w-4" />Property Address *</Label>
                      <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Street, Suburb, State, Postcode" required />
                    </div>

                    <div>
                      <Label htmlFor="service" className="text-sm sm:text-base">Service Type *</Label>
                      <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service} value={service}>{service}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.service === 'Other' && (
                      <div>
                        <Label htmlFor="otherService" className="text-sm sm:text-base">What are you looking for?</Label>
                        <Input id="otherService" value={formData.otherService} onChange={(e) => setFormData({ ...formData, otherService: e.target.value })} placeholder="What are you looking for?" required />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="notes" className="text-sm sm:text-base">Additional Notes</Label>
                      <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Notes for the team..." rows={3} />
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">What happens next?</h4>
                  <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                    <li>The job is created and auto-confirmed for the customer</li>
                    <li>The customer receives a confirmation email</li>
                    <li>You can still reschedule or cancel from the manage page</li>
                  </ol>
                </div>

                <Button type="submit" className="w-full text-sm sm:text-base" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Create & Confirm'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

