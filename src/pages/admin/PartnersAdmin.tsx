import { useEffect, useState } from 'react'
import { setSEO } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useNavigate } from 'react-router-dom'

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
      if (pResp.ok) setPartners((p.partners || []).map((pr: any) => ({ ...pr, _selected: new Set<string>(pr.assigned || []) })))
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

  async function updateAccess(id: string, bookingIds: string[]) {
    const auth = localStorage.getItem('aw_auth') || ''
    await fetch('/api/partners?action=update-access', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth}` }, body: JSON.stringify({ partnerId: id, bookingIds }) })
    await refresh()
  }

  async function changePassword(id: string, newPassword: string) {
    const auth = localStorage.getItem('aw_auth') || ''
    const resp = await fetch('/api/partners?action=change-password', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth}` }, body: JSON.stringify({ partnerId: id, newPassword }) })
    if (resp.ok) {
      alert('Password updated successfully')
    } else {
      const data = await resp.json().catch(() => ({}))
      alert(`Failed to update password: ${data.error || 'Unknown error'}`)
    }
  }

  return (
    <main className="pt-28">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/admin')}>← Back</Button>
            <h1 className="text-3xl font-bold">Partners</h1>
          </div>
          <div />
        </div>

        <div className="grid gap-4">
          {partners.map((p, idx) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{p.username}</span>
                  <Button variant="destructive" onClick={() => deletePartner(p.id)}>Delete</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">Change Password</div>
                <div className="flex gap-2">
                  <Input id={`pwd-${p.id}`} type="password" placeholder="New password" />
                  <Button onClick={() => {
                    const el = document.getElementById(`pwd-${p.id}`) as HTMLInputElement | null
                    changePassword(p.id, el?.value || '')
                  }}>Change Password</Button>
                </div>

                <div className="text-sm">Permissions</div>
                <div className="grid md:grid-cols-2 gap-2 max-h-64 overflow-auto p-1 border rounded">
                  {jobs.map((j) => {
                    const checked = p._selected?.has(j.booking_id)
                    return (
                      <label key={j.booking_id} className="flex items-center gap-2 p-2 border rounded">
                        <Checkbox
                          checked={!!checked}
                          onCheckedChange={(v) => {
                            const next = new Set<string>(p._selected || [])
                            if (v) next.add(j.booking_id); else next.delete(j.booking_id)
                            setPartners(prev => prev.map((pp, i) => i === idx ? { ...pp, _selected: next } : pp))
                          }}
                        />
                        <span className="text-sm">
                          {j.service}
                          <span className="text-muted-foreground ml-2">{j.address}</span>
                        </span>
                      </label>
                    )
                  })}
                </div>
                <div>
                  <Button onClick={() => updateAccess(p.id, Array.from(p._selected || []))}>Save Permissions</Button>
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


