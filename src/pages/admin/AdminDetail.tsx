import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { getBookingByBookingId, getQuoteById, updateBookingStatus, deleteBooking, deleteQuote, type Booking, type Quote } from '@/lib/supabase'
import { CheckCircle, XCircle, Mail, Phone, Calendar as CalendarIcon, Clock, MapPin, FileUp, Trash2 } from 'lucide-react'

export default function AdminDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [quoteFile, setQuoteFile] = useState<File | null>(null)
  const [quoteMessage, setQuoteMessage] = useState('')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [sendQuoteOpen, setSendQuoteOpen] = useState(false)
  const [declineOpen, setDeclineOpen] = useState(false)
  const [declineReason, setDeclineReason] = useState('')
  const [switchToJobOpen, setSwitchToJobOpen] = useState(false)
  const [switchAddress, setSwitchAddress] = useState('')
  const [switchService, setSwitchService] = useState('')
  const [switchDate, setSwitchDate] = useState('')
  const [switchTime, setSwitchTime] = useState('')

  const isQuote = useMemo(() => !!quote && !booking, [quote, booking])

  useEffect(() => {
    const load = async () => {
      if (!id) return
      setLoading(true)
      setError('')
      const b = await getBookingByBookingId(id)
      if (b) {
        setBooking(b)
        setQuote(null)
      } else {
        const q = await getQuoteById(id)
        if (q) setQuote(q)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleAccept = async () => {
    if (!booking) return
    try {
      setProcessing(true)
      setError('')
      const resp = await fetch('/api/confirm-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('aw_auth') || ''}` },
        body: JSON.stringify({ bookingId: booking.booking_id })
      })
      if (resp.ok) {
        setSuccess('Booking confirmed!')
        const updated = await getBookingByBookingId(booking.booking_id)
        setBooking(updated)
      } else {
        setError('Failed to confirm booking')
      }
    } finally {
      setProcessing(false)
    }
  }

  const handleCancel = async () => {
    if (!booking) return
    try {
      setProcessing(true)
      setError('')
      await updateBookingStatus(booking.booking_id, 'cancelled')
      const updated = await getBookingByBookingId(booking.booking_id)
      setBooking(updated)
      setSuccess('Booking cancelled')
    } catch {
      setError('Failed to cancel booking')
    } finally {
      setProcessing(false)
    }
  }

  const sendQuote = async () => {
    const recipient = booking?.email || quote?.email
    if (!recipient) return
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
          to: recipient,
          date: booking ? new Date(booking.date).toLocaleDateString('en-AU') : '',
          time: booking?.preferred_time || booking?.time || '',
          address: booking?.address || '',
          service: booking?.service || quote?.subject || 'Quote',
          job: booking?.is_inspection ? 'Job' : 'Quote',
          message: quoteMessage,
          pdfBase64: base64,
          pdfFilename: quoteFile.name
        })
      })
      if (response.ok) {
        setSuccess('Quote sent ✅')
        setQuoteFile(null)
        setQuoteMessage('')
      } else {
        setError('Failed to send quote')
      }
    } catch {
      setError('Failed to send quote')
    } finally {
      setProcessing(false)
    }
  }

  const confirmDelete = async () => {
    try {
      setProcessing(true)
      setError('')
      if (booking) {
        await deleteBooking(booking.booking_id)
      } else if (quote) {
        await deleteQuote(quote.quote_id)
      }
      navigate('/admin')
    } catch {
      setError('Failed to delete')
    } finally {
      setProcessing(false)
      setConfirmDeleteOpen(false)
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    accepted: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    sent: 'bg-green-100 text-green-800 border-green-200',
    declined: 'bg-red-100 text-red-800 border-red-200',
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!booking && !quote) return <div className="min-h-screen flex items-center justify-center">Not found</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/admin')}>← Back to Admin</Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{booking ? 'Job Details' : 'Quote Details'}</CardTitle>
              <Badge className={`${statusColors[(booking?.status || quote?.status) || 'pending']} px-4 py-1`}>
                {(booking?.status || quote?.status || '').toUpperCase()}
              </Badge>
            </div>
            <CardDescription>
              ID: <span className="font-mono">{booking?.booking_id || quote?.quote_id}</span>
              {booking && (
                <span className="ml-4">• Type: <strong>{booking.is_inspection ? 'Job' : 'Quote'}</strong></span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-semibold break-all select-text" style={{ pointerEvents: 'none' }}>{booking?.email || quote?.email}</p>
                </div>
              </div>
              {(booking?.phone || quote?.phone) && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Phone</p>
                    <p className="font-semibold select-text" style={{ pointerEvents: 'none' }}>{booking?.phone || quote?.phone}</p>
                  </div>
                </div>
              )}
              {booking && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Address</p>
                    <p className="font-semibold">{booking.address}</p>
                  </div>
                </div>
              )}
              {booking && (
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Date</p>
                    <p className="font-semibold">{new Date(booking.date).toLocaleDateString('en-AU')}</p>
                  </div>
                </div>
              )}
              {(booking?.preferred_time || booking?.time) && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Time</p>
                    <p className="font-semibold">{booking?.preferred_time || booking?.time}</p>
                  </div>
                </div>
              )}
            </div>

            {booking?.notes && (
              <div className="pt-2 border-t">
                <p className="text-sm text-slate-600 mb-2">Notes</p>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-lg">{booking.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right side actions mimic job page, with modifications */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>{isQuote ? 'Send or decline quote, contact customer' : 'Accept/decline, contact customer'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {!isQuote && booking?.status === 'pending' && (
                <Button onClick={handleAccept} disabled={processing} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" /> Accept
                </Button>
              )}
              {!isQuote && booking && (
                <Button variant="destructive" onClick={handleCancel} disabled={processing}>
                  <XCircle className="w-4 h-4 mr-2" /> Cancel
                </Button>
              )}
              <Button variant="outline" onClick={() => (window.location.href = `mailto:${booking?.email || quote?.email}`)}>
                <Mail className="w-4 h-4 mr-2" /> Email
              </Button>
              {(booking?.phone || quote?.phone) && (
                <Button variant="outline" onClick={() => (window.location.href = `tel:${booking?.phone || quote?.phone}`)}>
                  <Phone className="w-4 h-4 mr-2" /> Call
                </Button>
              )}
            </div>

            <div className="pt-2 border-t flex flex-wrap gap-3">
              {isQuote && (
                <Button variant="outline" onClick={() => setSwitchToJobOpen(true)}>Switch to Job</Button>
              )}
              <Button onClick={() => setSendQuoteOpen(true)} className="flex items-center">
                <FileUp className="w-4 h-4 mr-2" /> Send Quote
              </Button>
              {isQuote && (
                <Button variant="destructive" onClick={() => setDeclineOpen(true)}>
                  <XCircle className="w-4 h-4 mr-2" /> Decline Quote
                </Button>
              )}
            </div>

            {/* Delete */}
            <div className="pt-2 border-t">
              <Button variant="destructive" onClick={() => setConfirmDeleteOpen(true)} className="flex items-center">
                <Trash2 className="w-4 h-4 mr-2" /> Delete {isQuote ? 'Quote' : 'Job'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right column placeholder for Job Files */}
        {!isQuote && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Job Files</CardTitle>
              <CardDescription>Files related to this job (coming soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">No files yet.</div>
            </CardContent>
          </Card>
        )}

        {/* Confirm Delete Popup */}
        {confirmDeleteOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
              <p className="text-sm text-slate-600 mb-4">Are you sure you want to delete this {isQuote ? 'quote' : 'job'}? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete} disabled={processing}>Delete</Button>
              </div>
            </div>
          </div>
        )}

        {/* Send Quote Popup */}
        {sendQuoteOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold mb-4">Send Quote</h3>
              <div className="grid md:grid-cols-2 gap-4 items-end">
                <div>
                  <Label htmlFor="sendQuoteFile">Upload Quote (PDF)</Label>
                  <input id="sendQuoteFile" type="file" accept="application/pdf" onChange={(e) => setQuoteFile(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm" />
                </div>
                <div>
                  <Label htmlFor="sendQuoteMsg">Message (optional)</Label>
                  <Textarea id="sendQuoteMsg" value={quoteMessage} onChange={(e) => setQuoteMessage(e.target.value)} rows={4} className="mt-2" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setSendQuoteOpen(false)}>Cancel</Button>
                <Button onClick={() => { setSendQuoteOpen(false); sendQuote() }} disabled={processing || !quoteFile}>Send</Button>
              </div>
            </div>
          </div>
        )}

        {/* Decline Quote Popup */}
        {isQuote && declineOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold mb-2">Decline Quote</h3>
              <p className="text-sm text-slate-600 mb-3">Provide a brief reason to include in the email.</p>
              <Textarea rows={4} value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} />
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setDeclineOpen(false)}>Cancel</Button>
                <Button disabled={!declineReason.trim() || processing} onClick={async () => {
                  try {
                    setProcessing(true)
                    const response = await fetch('/api/email?type=quote', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('aw_auth') || ''}` },
                      body: JSON.stringify({ to: quote?.email, message: declineReason, declined: true, service: quote?.subject || 'Quote', job: 'Quote', date: '', time: '', address: '' })
                    })
                    if (response.ok) {
                      setSuccess('Decline email sent')
                      setDeclineReason('')
                      setDeclineOpen(false)
                    } else {
                      setError('Failed to send decline email')
                    }
                  } finally {
                    setProcessing(false)
                  }
                }}>Send Decline</Button>
              </div>
            </div>
          </div>
        )}

        {/* Switch to Job Popup */}
        {isQuote && switchToJobOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold mb-4">Switch Quote to Job</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Address</Label>
                  <Input value={switchAddress} onChange={(e) => setSwitchAddress(e.target.value)} />
                </div>
                <div>
                  <Label>Service</Label>
                  <select className="mt-2 w-full border rounded-md h-10 px-3" value={switchService} onChange={(e) => setSwitchService(e.target.value)}>
                    <option value="">Select a service</option>
                    <option>Balcony Leak Detection</option>
                    <option>Bathroom & Shower Waterproofing</option>
                    <option>Planter Box Waterproofing</option>
                    <option>Roof Deck & Podium Waterproofing</option>
                    <option>Caulking Solutions</option>
                    <option>Maintenance Plans</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={switchDate} onChange={(e) => setSwitchDate(e.target.value)} />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input type="time" value={switchTime} onChange={(e) => setSwitchTime(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setSwitchToJobOpen(false)}>Cancel</Button>
                <Button onClick={() => setSwitchToJobOpen(false)}>Create Job</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


