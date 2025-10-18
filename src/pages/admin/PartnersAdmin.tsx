import { useEffect, useState } from 'react'
import { setSEO } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSEO({ title: 'Partners | Admin', description: 'Manage partners and job access' })
    ;(async () => {
      await refresh()
    })()
  }, [])

  async function refresh() {
    setLoading(true)
    try {
      const auth = localStorage.getItem('aw_auth') || ''
      const [pResp, aResp] = await Promise.all([
        fetch('/api/partners?action=list', { headers: { Authorization: `Bearer ${auth}` } }),
        fetch('/api/admin', { headers: { Authorization: `Bearer ${auth}` } }),
      ])
      const p = await pResp.json()
      const a = await aResp.json()
      if (pResp.ok) setPartners(p.partners || [])
      if (aResp.ok) setJobs(a.bookings || [])
    } finally {
      setLoading(false)
    }
  }

  async function deletePartner(id: string) {
    const auth = localStorage.getItem('aw_auth') || ''
    await fetch('/api/partners?action=delete', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth}` }, body: JSON.stringify({ partnerId: id }) })
    await refresh()
  }

  async function updateAccess(id: string, bookingIdsCsv: string) {
    const bookingIds = bookingIdsCsv.split(',').map(s => s.trim()).filter(Boolean)
    const auth = localStorage.getItem('aw_auth') || ''
    await fetch('/api/partners?action=update-access', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth}` }, body: JSON.stringify({ partnerId: id, bookingIds }) })
    await refresh()
  }

  return (
    <main className="pt-28">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Partners</h1>
          <Button variant="outline" onClick={refresh} disabled={loading}>Refresh</Button>
        </div>

        <div className="grid gap-4">
          {partners.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{p.username}</span>
                  <Button variant="destructive" onClick={() => deletePartner(p.id)}>Delete</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">Password (hash stored). Show to partner: not stored in plaintext.</div>
                <div>
                  <div className="text-sm mb-2">Grant access to booking IDs (comma separated)</div>
                  <div className="flex gap-2">
                    <Input id={`access-${p.id}`} placeholder="BOOK-..., BOOK-..." />
                    <Button onClick={() => {
                      const el = document.getElementById(`access-${p.id}`) as HTMLInputElement | null
                      updateAccess(p.id, el?.value || '')
                    }}>Update Access</Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Recent jobs (click to copy ID):
                  <div className="mt-2 grid md:grid-cols-2 gap-2">
                    {jobs.slice(0, 10).map((j) => (
                      <button key={j.booking_id} className="text-left p-2 border rounded hover:bg-muted" onClick={() => navigator.clipboard.writeText(j.booking_id)}>
                        {j.booking_id} — {j.service} — {j.address}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {partners.length === 0 && <div className="text-muted-foreground">No partners yet.</div>}
        </div>
      </div>
    </main>
  )
}


