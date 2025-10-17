import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function CustomerBooking() {
  const { token } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [booking, setBooking] = useState<any>(null)
  const [statusMsg, setStatusMsg] = useState('')
  const [reschedDate, setReschedDate] = useState<Date | undefined>()
  const [reschedTime, setReschedTime] = useState('')

  const timeSlots = [
    '7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'
  ]

  const confirmed = useMemo(() => !!booking?.customer_confirmed_at, [booking])
  const rescheduled = useMemo(() => !!booking?.customer_rescheduled_time, [booking])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const resp = await fetch(`/api/customer-booking?token=${encodeURIComponent(token || '')}`)
        const data = await resp.json()
        if (!resp.ok) throw new Error(data.error || 'Failed to load')
        setBooking(data.booking)
      } catch (e: any) {
        setError(e.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    if (token) load()
  }, [token])

  const handleConfirm = async () => {
    try {
      setStatusMsg('Saving...')
      const resp = await fetch('/api/customer-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: 'confirm' })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Failed to confirm')
      setStatusMsg('Confirmed!')
      setBooking((b: any) => ({ ...b, customer_confirmed_at: new Date().toISOString() }))
    } catch (e: any) {
      setStatusMsg(e.message || 'Failed to confirm')
    }
  }

  const handleReschedule = async () => {
    try {
      if (!reschedDate || !reschedTime) {
        setStatusMsg('Please select a new date and time')
        return
      }
      // Compose ISO from date + time, same as booking page
      const [time, period] = reschedTime.split(' ')
      let [hours, minutes] = time.split(':').map(Number)
      if (period === 'PM' && hours !== 12) hours += 12
      if (period === 'AM' && hours === 12) hours = 0
      const dt = new Date(reschedDate)
      dt.setHours(hours, minutes || 0, 0, 0)
      const newTimeISO = dt.toISOString()
      setStatusMsg('Saving...')
      const resp = await fetch('/api/customer-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: 'reschedule', newTime: newTimeISO })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Failed to reschedule')
      setStatusMsg('Reschedule requested!')
      setBooking((b: any) => ({ ...b, customer_rescheduled_time: newTimeISO }))
    } catch (e: any) {
      setStatusMsg(e.message || 'Failed to reschedule')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" /> Your Booking
            </CardTitle>
            <CardDescription>Review and confirm or request a new time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{booking?.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="font-medium">{new Date(booking?.date).toLocaleDateString('en-AU')} • {booking?.preferred_time ? new Date(booking.preferred_time).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }) : booking?.time}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {(confirmed || rescheduled) ? (
          <div className="rounded-md bg-green-50 border border-green-200 text-green-800 p-3 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <div>
              {confirmed ? 'You have confirmed this booking.' : null}
              {rescheduled ? ` Reschedule requested to: ${new Date(booking.customer_rescheduled_time).toLocaleString('en-AU')}` : null}
            </div>
          </div>
        ) : (
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle className="text-xl">Confirm or Reschedule</CardTitle>
              <CardDescription>Choose a new date and time if needed (Mon–Fri only)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="w-full md:w-[320px] flex-none">
                  <Label className="mb-2 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={reschedDate}
                    onSelect={setReschedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    className="rounded-md border w-full"
                  />
                </div>
                <div className="relative z-0 md:min-w-0">
                  <Label className="mb-2 block">Preferred Start Time</Label>
                  <Select value={reschedTime} onValueChange={setReschedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots
                        .filter((t) => !t.includes('5:') || t.includes('5:00'))
                        .map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-6 flex gap-3">
                    <Button onClick={handleConfirm} className="bg-emerald-600 hover:bg-emerald-700">Confirm</Button>
                    <Button onClick={handleReschedule} variant="secondary">Request Reschedule</Button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">We’ll notify scheduling to review your request and confirm via email.</p>
            </CardContent>
          </Card>
        )}

        {statusMsg ? <div className="mt-4 text-sm text-muted-foreground">{statusMsg}</div> : null}
      </div>
    </div>
  )
}


