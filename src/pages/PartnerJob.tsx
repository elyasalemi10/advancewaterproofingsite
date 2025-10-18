import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function PartnerJob() {
  const { id } = useParams()
  const [job, setJob] = useState<any | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const partnerId = localStorage.getItem('partner_id') || ''
        if (!partnerId) throw new Error('Please log in as a partner to view this job')

        // Try cache first
        const cached = localStorage.getItem(`partner_jobs_${partnerId}`)
        if (cached) {
          try {
            const arr = JSON.parse(cached)
            const found = (arr || []).find((x: any) => x.booking_id === id)
            if (found) setJob(found)
          } catch {}
        }

        const resp = await fetch(`/api/partners?action=job&partnerId=${encodeURIComponent(partnerId)}&bookingId=${encodeURIComponent(id || '')}`)
        const data = await resp.json()
        if (!resp.ok) throw new Error(data.error || 'Failed to load')
        setJob(data.booking)
      } catch (e: any) {
        setError(e.message || 'Failed to load')
      }
    }
    if (id) load()
  }, [id])

  if (error) return <div className="pt-28 text-center text-red-600">{error}</div>
  if (!job) return <div className="pt-28 text-center">Loading...</div>

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    accepted: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
  }
  const formatTime = (timeString: string) => {
    if (!timeString) return ''
    const date = new Date(timeString)
    return date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', timeZone: 'Australia/Melbourne' })
  }

  function toGCalDate(dt: Date) {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}${pad(dt.getUTCSeconds())}Z`
  }

  function buildGoogleCalendarUrl() {
    try {
      const start = job.preferred_time ? new Date(job.preferred_time) : (job.date ? new Date(job.date) : null)
      if (!start || Number.isNaN(start.getTime())) return ''
      const end = new Date(start.getTime() + 60 * 60 * 1000)
      const dates = `${toGCalDate(start)}/${toGCalDate(end)}`
      const text = encodeURIComponent(job.service || 'Job')
      const details = encodeURIComponent(`- ${job.service}\n- ${job.address}\n- ${job.name}\n- ${job.email}\n- ${job.phone}`)
      const location = encodeURIComponent(job.address || '')
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`
    } catch {
      return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Job Overview</h1>
          <p className="text-slate-600">Restricted partner view (read-only)</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Booking Details</CardTitle>
              <Badge className={`${statusColors[job.status || 'pending']} px-4 py-1`}>
                {(job.status || 'pending').toUpperCase()}
              </Badge>
            </div>
            <CardDescription>
              {/* Booking ID intentionally hidden in partner view */}
              {job.is_inspection !== undefined && (
                <span className="ml-0">
                  Type: <strong>{job.is_inspection ? 'Job' : 'Quote'}</strong>
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Customer Name</p>
                  <p className="font-semibold">{job.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-semibold break-all select-text" style={{ pointerEvents: 'none' }}>{job.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Phone</p>
                  <p className="font-semibold select-text" style={{ pointerEvents: 'none' }}>{job.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Address</p>
                  <p className="font-semibold">{job.address}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Date</p>
                    <p className="font-semibold">{formatDate(job.date)}</p>
                  </div>
                </div>
                {job.preferred_time && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-600">Preferred Time</p>
                      <p className="font-semibold">{formatTime(job.preferred_time)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {job.notes && (
              <div className="pt-4 border-t">
                <p className="text-sm text-slate-600 mb-2">Additional Notes</p>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-lg">{job.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => {
            const url = buildGoogleCalendarUrl()
            if (url) window.open(url, '_blank')
          }} disabled={!job || !job.preferred_time}>
            Add to my Google Calendar
          </Button>
          <Button variant="ghost" onClick={() => (window.location.href = '/partners')}>← Back to My Jobs</Button>
        </div>
      </div>
    </div>
  )
}


