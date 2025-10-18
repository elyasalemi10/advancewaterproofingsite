import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, MapPin, CheckCircle, XCircle, MessageCircle, Loader2, RefreshCw, Ban } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getBookingByBookingId, updateBookingStatus, type Booking } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function ManageBookings() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [declineReason, setDeclineReason] = useState('')
  const [showDeclineForm, setShowDeclineForm] = useState(false)
  const [quoteFile, setQuoteFile] = useState<File | null>(null)
  const [quoteMessage, setQuoteMessage] = useState('')
  const [suggestOpen, setSuggestOpen] = useState(false)
  const [suggestDate, setSuggestDate] = useState<Date | undefined>()
  const [suggestTime, setSuggestTime] = useState('')

  const bookingId = searchParams.get('id')

  useEffect(() => {
    if (!bookingId) {
      setError('No booking ID provided')
      setLoading(false)
      return
    }
    loadBooking()
  }, [bookingId])

  const loadBooking = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getBookingByBookingId(bookingId!)
      
      if (!data) {
        setError('Booking not found')
      } else {
        setBooking(data)
      }
    } catch (err) {
      setError('Failed to load booking')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!booking) return

    try {
      setProcessing(true)
      setError('')
      
      // Call confirm-booking API which will update status and notify customer
      const response = await fetch('/api/confirm-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('aw_auth') || ''}`,
        },
        body: JSON.stringify({ bookingId: bookingId })
      })
      
      if (response.ok) {
        const result = await response.json()
        setSuccess('Booking confirmed! Customer notified. ✅')
        setTimeout(() => loadBooking(), 1500)
      } else {
        const errorData = await response.json()
        setError(`Failed to confirm booking: ${errorData.error || 'Unknown error'}`)
      }
    } catch (err) {
      setError('Failed to confirm booking')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleCancel = async () => {
    if (!booking) return
    try {
      setProcessing(true)
      setError('')
      const response = await fetch('/api/confirm-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('aw_auth') || ''}` },
        body: JSON.stringify({ bookingId: bookingId, cancel: true })
      })
      if (response.ok) {
        setSuccess('Booking cancelled and customer notified ❌')
        setTimeout(() => loadBooking(), 1200)
      } else {
        const errorData = await response.json()
        setError(`Failed to cancel booking: ${errorData.error || 'Unknown error'}`)
      }
    } catch (e) {
      setError('Failed to cancel booking')
    } finally {
      setProcessing(false)
    }
  }

  const sendQuote = async () => {
    if (!booking) return
    if (!quoteFile) {
      setError('Please select a PDF to send')
      return
    }
    try {
      setProcessing(true)
      setError('')

      const fileArrayBuffer = await quoteFile.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(fileArrayBuffer)))

      const response = await fetch('/api/email?type=quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('aw_auth') || ''}` },
        body: JSON.stringify({
          to: booking.email,
          date: formatDate(booking.date),
          time: formatTime(booking.preferred_time || booking.time),
          address: booking.address,
          service: booking.service,
          job: booking.is_inspection ? 'Job' : 'Quote',
          message: quoteMessage,
          pdfBase64: base64,
          pdfFilename: quoteFile.name
        })
      })

      if (response.ok) {
        setSuccess('Quote sent to customer ✅')
        setQuoteFile(null)
        setQuoteMessage('')
      } else {
        const errorData = await response.json()
        setError(`Failed to send quote: ${errorData.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to send quote')
    } finally {
      setProcessing(false)
    }
  }

  const sendSuggestion = async () => {
    if (!booking || !suggestDate || !suggestTime) {
      setError('Select a date and time to suggest')
      return
    }
    try {
      setProcessing(true)
      setError('')

      const response = await fetch('/api/suggest-booking-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('aw_auth') || ''}` },
        body: JSON.stringify({
          bookingId: booking.booking_id,
          date: suggestDate.toISOString(),
          time: suggestTime
        })
      })

      if (response.ok) {
        setSuccess('Suggested a new time to the customer ✅')
        setSuggestOpen(false)
        setSuggestDate(undefined)
        setSuggestTime('')
      } else {
        const errText = await response.text()
        setError(errText || 'Failed to suggest time')
      }
    } catch (e) {
      setError('Failed to suggest time')
    } finally {
      setProcessing(false)
    }
  }

  const handleDecline = async () => {
    if (!booking) return

    try {
      setProcessing(true)
      setError('')
      
      // Update status in Supabase
      const updated = await updateBookingStatus(bookingId!, 'cancelled')
      
      if (updated) {
        setSuccess('Booking declined and cancelled ❌')
        setTimeout(() => loadBooking(), 1000)
        setShowDeclineForm(false)
      } else {
        setError('Failed to decline booking')
      }
    } catch (err) {
      setError('Failed to decline booking')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return ''
    const date = new Date(timeString)
    return date.toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Australia/Melbourne'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-8 h-8 text-red-500" />
              <CardTitle>Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!booking) {
    return null
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    accepted: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Booking Management
          </h1>
          <p className="text-slate-600">
            Review and manage this booking request
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Booking Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Booking Details</CardTitle>
              <Badge className={`${statusColors[booking.status]} px-4 py-1`}>
                {booking.status.toUpperCase()}
              </Badge>
            </div>
            <CardDescription>
              Booking ID: <span className="font-mono">{booking.booking_id}</span>
              {booking.is_inspection !== undefined && (
                <span className="ml-4">
                  • Type: <strong>{booking.is_inspection ? 'Job' : 'Quote'}</strong>
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Customer Name</p>
                  <p className="font-semibold">{booking.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-semibold break-all select-text" style={{ pointerEvents: 'none' }}>
                    {booking.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Phone</p>
                  <p className="font-semibold select-text" style={{ pointerEvents: 'none' }}>
                    {booking.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Address</p>
                  <p className="font-semibold">{booking.address}</p>
                </div>
              </div>
            </div>

            {/* Service & Schedule */}
            <div className="pt-4 border-t">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Service Requested</p>
                    <p className="font-semibold">{booking.service}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Date</p>
                    <p className="font-semibold">{formatDate(booking.date)}</p>
                  </div>
                </div>

                {booking.preferred_time && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-600">Preferred Time</p>
                      <p className="font-semibold">{formatTime(booking.preferred_time)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="pt-4 border-t">
                <p className="text-sm text-slate-600 mb-2">Additional Notes</p>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-lg">{booking.notes}</p>
              </div>
            )}

            
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {booking.status === 'pending' && booking.is_inspection && (
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Accept or decline this booking request</CardDescription>
            </CardHeader>
            <CardContent>
              {!showDeclineForm ? (
                <div className="grid md:grid-cols-5 gap-3">
                  <Button 
                    onClick={handleAccept}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Accept
                  </Button>

                  <Button 
                    onClick={handleCancel}
                    disabled={processing}
                    variant="destructive"
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Ban className="w-4 h-4 mr-2" />
                    )}
                    Cancel
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setSuggestOpen(true)}
                    disabled={processing}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Suggest Other Time
                  </Button>

                  <Button 
                    onClick={() => setShowDeclineForm(true)}
                    disabled={processing}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Decline
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = `mailto:${booking.email}?subject=Re: Booking Request ${booking.booking_id}`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = `tel:${booking.phone}`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reason">Decline Reason (Optional)</Label>
                    <Textarea
                      id="reason"
                      placeholder="Let the customer know why..."
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleDecline}
                      disabled={processing}
                      variant="destructive"
                      className="flex-1"
                    >
                      {processing ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Confirm Decline
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        setShowDeclineForm(false)
                        setDeclineReason('')
                      }}
                      disabled={processing}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {suggestOpen && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Suggest a Different Time</CardTitle>
              <CardDescription>
                Sorry we are not available at the requested time. Suggest an alternative below. The customer will receive a detailed email with the context and your suggested time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="w-full md:w-[320px] flex-none relative z-0 overflow-hidden">
                  <Label className="mb-2 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={suggestDate}
                    onSelect={setSuggestDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    className="rounded-md border w-full"
                  />
                </div>
                <div className="relative z-0 md:min-w-0">
                  <Label className="mb-2 block">Preferred Start Time</Label>
                  <Select value={suggestTime} onValueChange={setSuggestTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {['7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={sendSuggestion} disabled={processing || !suggestDate || !suggestTime}>Send Suggestion</Button>
                <Button variant="ghost" onClick={() => setSuggestOpen(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quote Actions */}
        {booking.status === 'pending' && booking.is_inspection === false && (
          <Card>
            <CardHeader>
              <CardTitle>Quote Actions</CardTitle>
              <CardDescription>Upload a PDF quote and send to customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 items-end">
                <div>
                  <Label htmlFor="quoteFile">Quote PDF</Label>
                  <input
                    id="quoteFile"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setQuoteFile(e.target.files?.[0] || null)}
                    className="mt-2 block w-full text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="quoteMessage">Message (optional)</Label>
                  <Textarea
                    id="quoteMessage"
                    placeholder="Add a short message for the customer"
                    value={quoteMessage}
                    onChange={(e) => setQuoteMessage(e.target.value)}
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={sendQuote} disabled={processing || !quoteFile} className="flex items-center">
                  {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileUp className="w-4 h-4 mr-2" />}
                  Send Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Already Processed */}
        {booking.status !== 'pending' && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                {booking.status === 'accepted' ? (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                    <h3 className="text-xl font-semibold text-slate-900">Booking Accepted</h3>
                    <p className="text-slate-600">
                      This booking has already been accepted.
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 text-red-600 mx-auto" />
                    <h3 className="text-xl font-semibold text-slate-900">Booking Cancelled</h3>
                    <p className="text-slate-600">
                      This booking has been cancelled.
                    </p>
                  </>
                )}
                
                <div className="flex gap-3 justify-center pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = `mailto:${booking.email}`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Customer
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = `tel:${booking.phone}`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Customer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

