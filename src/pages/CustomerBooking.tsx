import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function CustomerBooking() {
  const { token } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [booking, setBooking] = useState<any>(null)
  const [statusMsg, setStatusMsg] = useState('')
  const [reschedTime, setReschedTime] = useState('')

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
      if (!reschedTime) {
        setStatusMsg('Please select a new time')
        return
      }
      setStatusMsg('Saving...')
      const resp = await fetch('/api/customer-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: 'reschedule', newTime: reschedTime })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Failed to reschedule')
      setStatusMsg('Reschedule requested!')
      setBooking((b: any) => ({ ...b, customer_rescheduled_time: reschedTime }))
    } catch (e: any) {
      setStatusMsg(e.message || 'Failed to reschedule')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Your Booking</h1>
        <div className="rounded-lg border p-4 mb-4">
          <div className="text-sm text-muted-foreground mb-2">Booking ID: {booking?.booking_id}</div>
          <div className="space-y-1">
            <div><strong>Service:</strong> {booking?.service}</div>
            <div><strong>Address:</strong> {booking?.address}</div>
            <div><strong>Date:</strong> {new Date(booking?.date).toLocaleDateString('en-AU')}</div>
            <div><strong>Preferred Time:</strong> {booking?.preferred_time ? new Date(booking.preferred_time).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }) : booking?.time}</div>
          </div>
        </div>

        {(confirmed || rescheduled) ? (
          <div className="rounded-md bg-green-50 border border-green-200 text-green-800 p-3 mb-4">
            {confirmed ? 'You have confirmed this booking.' : null}
            {rescheduled ? ` Reschedule requested to: ${new Date(booking.customer_rescheduled_time).toLocaleString('en-AU')}` : null}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3">
              <button onClick={handleConfirm} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">Confirm</button>
              <button onClick={handleReschedule} className="px-4 py-2 rounded bg-slate-600 text-white hover:bg-slate-700">Reschedule</button>
            </div>
            <div className="rounded-lg border p-4">
              <label className="block text-sm font-medium mb-2">Choose a new date/time</label>
              <input type="datetime-local" value={reschedTime} onChange={(e) => setReschedTime(e.target.value)} className="w-full border rounded px-3 py-2" />
              <p className="text-xs text-muted-foreground mt-2">We will review and confirm your reschedule request.</p>
            </div>
          </div>
        )}

        {statusMsg ? <div className="mt-4 text-sm text-muted-foreground">{statusMsg}</div> : null}
      </div>
    </div>
  )
}


