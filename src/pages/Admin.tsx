import { useEffect, useState } from 'react'
import { setSEO } from '@/lib/seo'
import { Shield, PlusCircle, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Admin() {
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, cancelled: 0 })
  const [jobs, setJobs] = useState<any[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const resp = await fetch('/api/admin', { headers: { Authorization: `Bearer ${localStorage.getItem('aw_auth') || ''}` } })
        const data = await resp.json()
        if (resp.ok) {
          setStats(data.stats)
          setJobs(data.bookings || [])
        }
      } catch {}
    })()
  }, [])
  useEffect(() => {
    setSEO({
      title: 'Admin Dashboard | Advance Waterproofing',
      description: 'Manage media uploads, bookings, and website content.',
    })
  }, [])

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your website content and media
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border p-4 bg-white">
            <div className="text-sm text-muted-foreground">Total Jobs</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>
          <div className="rounded-lg border p-4 bg-white">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-3xl font-bold">{stats.pending}</div>
          </div>
          <div className="rounded-lg border p-4 bg-white">
            <div className="text-sm text-muted-foreground">Confirmed</div>
            <div className="text-3xl font-bold">{stats.accepted}</div>
          </div>
          <div className="rounded-lg border p-4 bg-white">
            <div className="text-sm text-muted-foreground">Cancelled</div>
            <div className="text-3xl font-bold">{stats.cancelled}</div>
          </div>
        </div>

        <div className="mb-8 flex gap-3">
          <Button onClick={() => (window.location.href = '/admin/create-job')}>
            <PlusCircle className="w-5 h-5 mr-2" /> Create Job
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = '/admin/create-partner')}>
            <UserPlus className="w-5 h-5 mr-2" /> Create Partner
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = '/partners')}>
            Partners
          </Button>
        </div>

        <div className="grid gap-4">
          {jobs.map((j) => (
            <Card key={j.booking_id} onClick={() => (window.location.href = `/manage-booking?id=${j.booking_id}`)} className="cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{j.service}</div>
                  <div className="text-sm text-muted-foreground">{j.address}</div>
                </div>
                <div className={`px-3 py-1 rounded text-sm ${j.status === 'accepted' ? 'bg-green-100 text-green-700' : j.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{j.status}</div>
              </CardContent>
            </Card>
          ))}
          {jobs.length === 0 && <div className="text-muted-foreground">No jobs found.</div>}
        </div>
        
      </div>
    </div>
  )
}
